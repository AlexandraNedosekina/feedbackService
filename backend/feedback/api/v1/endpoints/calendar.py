import datetime
import logging

from fastapi import APIRouter, Body, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import GetUserWithRoles, get_current_user, get_db, is_allowed

EKB_UTC_OFFSET = 5

logger = logging.getLogger(__name__)
router = APIRouter()
get_admin_boss_manager_hr = GetUserWithRoles(["admin", "boss", "manager", "hr"])


@router.get("/me", response_model=list[schemas.CalendarEvent])
def get_events_for_current_user(
    date: datetime.date = Query(..., example="2023-02-23", description="Date UTC"),
    format: schemas.CalendarFormat = Query(
        ..., description="Determines the range of return events"
    ),
    status: schemas.CalendarEventStatus = Query(
        None, description="Filter by status. If not specified will contain everything"
    ),
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
):
    events = crud.calendar.get_with_common_queries(
        db, user_id=curr_user.id, date=date, format=format, status=status
    )
    return events


@router.get("/{cal_id}", response_model=schemas.CalendarEvent)
def get_event_by_id(
    cal_id: int, db: Session = Depends(get_db), curr_user=Depends(get_current_user)
):
    event = crud.calendar.get(db, cal_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if (
        event.owner_id != curr_user.id
        and event.user_id != curr_user.id
        and not is_allowed(curr_user, None, ["HR", "manager", "boss", "admin"])
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not associdated with this event",
        )

    return event


@router.post("/", response_model=schemas.CalendarEvent)
def create_event(
    cal_event_create: schemas.CalendarEventCreate,
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
):
    logger.debug(cal_event_create)

    user = crud.user.get(db, cal_event_create.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with id {cal_event_create.user_id} does not exist",
        )

    if curr_user.id == user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You cant create event to yourself",
        )

    # TODO: Check if user is colleague

    # NOTE: Not good, better to store start/work_hours already in utc
    if user.work_hours_end and user.work_hours_start:
        work_start_utc = convert_time_to_utc(user.work_hours_start, EKB_UTC_OFFSET)
        work_end_utc = convert_time_to_utc(user.work_hours_end, EKB_UTC_OFFSET)
        if (
            work_start_utc > cal_event_create.date_start.time()
            or work_end_utc < cal_event_create.date_end.time()
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User doesnt work at this time",
            )

    overlaps = crud.calendar.get_overlapping_events(
        db,
        start=cal_event_create.date_start,
        end=cal_event_create.date_end,
        user_id=user.id,
    )
    if overlaps:
        logger.debug(overlaps)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User has overlaping events"
        )

    # TODO: Check users meeting readiness
    # NOTE: Does 'work from home' have impact on logic

    event = crud.calendar.create(db, obj_in=cal_event_create, owner_id=curr_user.id)
    return event


@router.patch("/{id}", response_model=schemas.CalendarEvent)
def update_calendar_event(
    id: int, db: Session = Depends(get_db), curr_user=Depends(get_current_user)
):
    pass


@router.delete("/{cal_id}")
def delete_calendar_event(
    cal_id: int, db: Session = Depends(get_db), curr_user=Depends(get_current_user)
):
    event = crud.calendar.get(db, cal_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if event.owner_id != curr_user.owner_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You must be creator to delete",
        )
    if event.status == schemas.CalendarEventStatus.ACCEPTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cant do that if event is accepted",
        )
    crud.calendar.remove(db, id=event.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/",
    description="Only for users with roles [admin, boss, manager, hr]",
    dependencies=[Depends(get_admin_boss_manager_hr)],
    response_model=list[schemas.CalendarEvent],
)
def get_events_by_user_id(
    user_id: int,
    date: datetime.date = Query(..., example="2023-02-23", description="Date UTC"),
    format: schemas.CalendarFormat = Query(
        ..., description="Determines the range of return events"
    ),
    status: schemas.CalendarEventStatus = Query(
        None, description="Filter by status. If not specified will contain everything"
    ),
    db: Session = Depends(get_db),
):
    events = crud.calendar.get_with_common_queries(
        db, user_id=user_id, date=date, format=format, status=status
    )
    return events


@router.post("/{event_id}/accept", response_model=schemas.CalendarEvent)
def accept_event(
    event_id: int, db: Session = Depends(get_db), curr_user=Depends(get_current_user)
):
    event = crud.calendar.get(db, id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if event.user_id != curr_user.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    if event.status not in (
        schemas.CalendarEventStatus.PENDING,
        schemas.CalendarEventStatus.RESHEDULED,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action on this event already prefomed",
        )

    event = crud.calendar.update_status(
        db, db_obj=event, status=schemas.CalendarEventStatus.ACCEPTED
    )

    # TODO: Send notification to event owner
    return event


@router.post("/{event_id}/reject", response_model=schemas.CalendarEvent)
def reject_event(
    event_id: int,
    rejection_cause: str = Body("", embed=True),
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
):
    event = crud.calendar.get(db, id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if event.user_id != curr_user.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    if event.status not in (
        schemas.CalendarEventStatus.PENDING,
        schemas.CalendarEventStatus.RESHEDULED,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action on this event already prefomed",
        )

    event = crud.calendar.reject(db, db_obj=event, rejection_cause=rejection_cause)

    # TODO: Send notification to event owner
    return event


@router.post("/{event_id}/reshedule", response_model=schemas.CalendarEvent)
def reshedule_event(
    event_id: int,
    resheduled_event: schemas.CalendarEventReshedule,
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
):
    event = crud.calendar.get(db, id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if event.user_id != curr_user.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    if event.status not in (
        schemas.CalendarEventStatus.PENDING,
        schemas.CalendarEventStatus.RESHEDULED,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action on this event already performed",
        )

    if (
        resheduled_event.date_start
        and event.date_start == resheduled_event.date_start.replace(tzinfo=None)
    ) and (
        resheduled_event.date_end
        and event.date_end == resheduled_event.date_end.replace(tzinfo=None)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Date must differ from previous",
        )

    overlaps = crud.calendar.get_overlapping_events(
        db,
        start=resheduled_event.date_start,
        end=resheduled_event.date_end,
        user_id=event.owner_id,
    )
    if overlaps:
        logger.debug(overlaps)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User has overlaping events"
        )

    event = crud.calendar.reshedule(db, db_obj=event, resheduled=resheduled_event)

    # TODO: Send notification to event owner (prev owner)
    return event


def convert_time_to_utc(time: datetime.time, offset: int) -> datetime.time:
    return (
        datetime.datetime.combine(datetime.date.today(), time)
        - datetime.timedelta(hours=offset)
    ).time()
