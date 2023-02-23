import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from sqlalchemy.orm import Session
from feedback import crud, models, schemas
from feedback.api.deps import GetUserWithRoles, get_current_user, get_db
import datetime

EKB_UTC_OFFSET = 5

logger = logging.getLogger(__name__)
router = APIRouter()
get_admin_boss_manager_hr = GetUserWithRoles(["admin", "boss", "manager", "hr"])


@router.get("/me")
def get_events_for_current_user(
        date: datetime.date = Query(..., example="2023-02-23", description="Date UTC"),
        format: schemas.CalendarFormat = Query(..., description="Determines the range of return events"),
        status: schemas.CalendarEventStatus = Query(None, description="Filter by status. If not specified will contain everything"),
        db: Session = Depends(get_db),
        curr_user=Depends(get_current_user)
):
    events = crud.calendar.get_with_common_queries(
            db,
            user_id=curr_user.id,
            date=date,
            format=format, 
            status=status
    )
    return events


# TODO: Roles
@router.get("/{cal_id}")
def get_event_by_id(
        cal_id: int,
        db: Session = Depends(get_db),
        curr_user=Depends(get_current_user)
):
    event = crud.calendar.get(db, cal_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return event


@router.post("/", response_model=schemas.CalendarEvent)
def create_event(
        cal_event_create: schemas.CalendarEventCreate,
        db: Session = Depends(get_db),
        curr_user=Depends(get_current_user)
):
    logger.debug(cal_event_create)
    
    user = crud.user.get(db, cal_event_create.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with id {cal_event_create.user_id} does not exist"
        )

    if curr_user.id == user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You cant create event to yourself"
        )
    
    # TODO: Check if user is colleague

    # NOTE: Not good, better to store start/work_hours already in utc
    if user.work_hours_end and user.work_hours_start:
        work_start_utc = convert_time_to_utc(user.work_hours_start, EKB_UTC_OFFSET)
        work_end_utc = convert_time_to_utc(user.work_hours_end, EKB_UTC_OFFSET)
        if (work_start_utc > cal_event_create.date_start.time() or work_end_utc < cal_event_create.date_end.time()):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User doesnt work at this time"
            )

    overlaps = crud.calendar.get_overlapping_events(
            db,
            start=cal_event_create.date_start,
            end=cal_event_create.date_end,
            user_id=user.id
    )
    if overlaps:
        logger.debug(overlaps)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User has overlaping events")

    # TODO: Check users meeting readiness
    # NOTE: Does 'work from home' have impact on logic

    event = crud.calendar.create(
        db,
        obj_in=cal_event_create,
        owner_id=curr_user.id
    )
    return event


@router.patch("/{id}")
def update_calendar_event(
        id: int,
        db: Session = Depends(get_db),
        curr_user=Depends(get_current_user)
):
    pass


@router.delete("/{cal_id}")
def delete_calendar_event(
        cal_id: int,
        db: Session = Depends(get_db),
        curr_user=Depends(get_current_user)
):
    event = crud.calendar.get(db, cal_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if event.owner_id != curr_user.owner_id:
        raise HTTPException(status_code=status.HTTP_401, detail="You must be creator to delete")
    crud.calendar.remove(db, id=event.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
        "/",
        description="Only for users with roles [admin, boss, manager, hr]",
        dependencies=[Depends(get_admin_boss_manager_hr)]
)
def get_events_by_user_id(
        user_id: int,
        date: datetime.date = Query(..., example="2023-02-23", description="Date UTC"),
        format: schemas.CalendarFormat = Query(..., description="Determines the range of return events"),
        status: schemas.CalendarEventStatus = Query(None, description="Filter by status. If not specified will contain everything"),
        db: Session = Depends(get_db),
):
    events = crud.calendar.get_with_common_queries(
            db,
            user_id=user_id,
            date=date,
            format=format, 
            status=status
    )
    return events


def convert_time_to_utc(time: datetime.time, offset: int) -> datetime.time:
    return (
        datetime.datetime.combine(
            datetime.date.today(),
            time
        ) - datetime.timedelta(hours=offset)
    ).time()

