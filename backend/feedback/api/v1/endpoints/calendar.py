import logging
from datetime import date, datetime, time, timedelta

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Body,
    Depends,
    HTTPException,
    Query,
    Response,
    status,
)
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import (
    GetUserWithRoles,
    get_current_user,
    get_db,
    get_notifiers,
    is_allowed,
)
from feedback.notifications.notifiers import AbstractNotifier

EKB_UTC_OFFSET = 5

logger = logging.getLogger(__name__)
router = APIRouter()
get_admin_boss_manager_hr = GetUserWithRoles(["admin", "boss", "manager", "hr"])


@router.get("/me", response_model=list[schemas.CalendarEvent])
def get_calendar_events_for_current_user(
    date: date = Query(..., example="2023-02-23", description="UTC Date"),
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


@router.get("/{calendar_id}", response_model=schemas.CalendarEvent)
def get_calendar_event_by_id(
    calendar_id: int, db: Session = Depends(get_db), curr_user=Depends(get_current_user)
):
    """
    Returns calendar event with provided id
    If user is associdated with that event. (Associated = if user is creator or participant or user has one of the roles [HR, manager, boss, admin])
    """
    event = crud.calendar.get(db, calendar_id)
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
def create_calendar_event(
    cal_event_create: schemas.CalendarEventCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
    notifiers: AbstractNotifier = Depends(get_notifiers),
):
    """
    Creates calendar event.
    Cant create if creator is not participants colleague
    and creator does not have one of the roles [HR, manager, boss, admin]

    - **date_start**: Event end datetime in UTC with timezone. Example: UTC: `2023-02-26T12:30:00Z`, EKB: `2023-02-26T15:00:00+05:00`
    - **date_end**: Event end datetime in UTC with timezone. Example: UTC: `2023-02-26T12:30:00Z`, EKB: `2023-02-26T15:00:00+05:00`
    """
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

    # TODO: if user is trainee => he can create event to his mentor
    if curr_user.id not in user.get_colleagues_id and not is_allowed(
        curr_user, None, ["admin", "boss", "manager", "HR"]
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cant create event with this user, because you are not his/her colleague",
        )

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

    event = crud.calendar.create(db, obj_in=cal_event_create, owner_id=curr_user.id)
    background_tasks.add_task(
        notifiers.send,
        event.user_id,
        f"{event.owner.full_name.title()} created new meeting",
        "calendar.create",
        db=db,
    )
    return event


@router.patch("/{calendar_id}", response_model=schemas.CalendarEvent)
def update_calendar_event(
    calendar_id: int,
    calendar_event_update: schemas.CalendarEventUpdate,
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
):
    """
    Updates calendar event with provided id.
    Only creator of event can update it.
    If event status is `Accpeted` you cant update it.
    """
    event = crud.calendar.get(db, calendar_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if event.owner_id != curr_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You must be creator to delete",
        )

    if event.status == schemas.CalendarEventStatus.ACCEPTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cant do that if event is accepted",
        )

    # If only 1 of the dates is changed. check with val in db
    start = calendar_event_update.date_start
    end = calendar_event_update.date_end
    if bool(start) != bool(end):
        if (start and event.date_end <= start.replace(tzinfo=None)) or (
            end and event.date_start >= end.replace(tzinfo=None)
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="date_start cant cant be smaller or equal to date_end",
            )

    event = crud.calendar.update(db, db_obj=event, obj_in=calendar_event_update)
    return event


@router.delete("/{calendar_id}")
def delete_calendar_event(
    calendar_id: int, db: Session = Depends(get_db), curr_user=Depends(get_current_user)
):
    """
    Deletes calendar event with provided id.
    Only creator of event can delete it.
    If event status is `Accepted` you cant delete it.
    """

    event = crud.calendar.get(db, calendar_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if event.owner_id != curr_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You must be creator to delete",
        )

    if event.status == schemas.CalendarEventStatus.ACCEPTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cant do that if event is accepted",
        )

    crud.calendar.remove(db, id=calendar_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/",
    dependencies=[Depends(get_admin_boss_manager_hr)],
    response_model=list[schemas.CalendarEvent],
)
def get_calendar_events_by_user_id(
    user_id: int,
    date: date = Query(..., example="2023-02-23", description="Date UTC"),
    format: schemas.CalendarFormat = Query(
        ..., description="Determines the range of return events"
    ),
    status: schemas.CalendarEventStatus = Query(
        None, description="Filter by status. If not specified will contain everything"
    ),
    db: Session = Depends(get_db),
):
    """
    Only for users with roles [admin, boss, manager, hr]
    """
    events = crud.calendar.get_with_common_queries(
        db, user_id=user_id, date=date, format=format, status=status
    )
    return events


@router.post("/{calendar_id}/accept", response_model=schemas.CalendarEvent)
def accept_calendar_event(
    calendar_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
    notifiers: AbstractNotifier = Depends(get_notifiers),
):
    event = crud.calendar.get(db, id=calendar_id)
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

    background_tasks.add_task(
        notifiers.send,
        event.owner_id,
        f"{event.user.full_name.title()} accepted your meeting",
        "calendar.accept",
        db=db,
    )
    return event


@router.post("/{calendar_id}/reject", response_model=schemas.CalendarEvent)
def reject_calendar_event(
    calendar_id: int,
    background_tasks: BackgroundTasks,
    rejection_cause: str = Body("", embed=True),
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
    notifiers: AbstractNotifier = Depends(get_notifiers),
):
    event = crud.calendar.get(db, id=calendar_id)
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

    background_tasks.add_task(
        notifiers.send,
        event.owner_id,
        f"{event.user.full_name.title()} rejected your meeting",
        "calendar.reject",
        db=db,
    )
    return event


@router.post("/{calendar_id}/reshedule", response_model=schemas.CalendarEvent)
def reshedule_calendar_event(
    calendar_id: int,
    resheduled_event: schemas.CalendarEventReshedule,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
    notifiers: AbstractNotifier = Depends(get_notifiers),
):
    event = crud.calendar.get(db, id=calendar_id)
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

    background_tasks.add_task(
        notifiers.send,
        event.user_id,
        f"{event.owner.full_name.title()} resheduled your meeting",
        "calendar.reshedule",
        db=db,
    )
    return event


def convert_time_to_utc(time: time, offset: int) -> time:
    return (datetime.combine(date.today(), time) - timedelta(hours=offset)).time()
