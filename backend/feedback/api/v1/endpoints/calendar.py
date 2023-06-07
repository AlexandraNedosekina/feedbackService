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
from feedback.crud.calendar import OverlappingEventError
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
    logger.debug(
        f"Getting events for current user {curr_user.id=} with queries {date=}, {format=}, {status=}"
    )
    events = crud.calendar.get_with_common_queries(
        db, user_id=curr_user.id, date=date, format=format, status=status
    )
    logger.debug(f"Found events {events}")
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
            detail="You cant create event to yourself",
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
                detail="User doesnt work at this time",
            )

    if crud.calendar.get_overlapping_events(
        db,
        start=cal_event_create.date_start,
        end=cal_event_create.date_end,
        user_id=user.id,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User has overlaping events"
        )

    event = crud.calendar.create(db, obj_in=cal_event_create, owner_id=curr_user.id)
    background_tasks.add_task(
        notifiers.send,
        event.user_id,
        f"{event.owner.full_name.title()} создал (-а) новую встречу",
        "calendar.create",
        db=db,
    )
    return event


@router.patch("/{calendar_id}", response_model=schemas.CalendarEvent)
def update_calendar_event(
    calendar_id: int,
    calendar_event_update: schemas.CalendarEventUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
    notifiers: AbstractNotifier = Depends(get_notifiers),
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
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be creator to update",
        )

    if event.status == schemas.CalendarEventStatus.ACCEPTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cant do that if event is accepted",
        )

    # Check if new user is current user
    if calendar_event_update.user_id == curr_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы не можете назначить встречу самому себе",
        )

    new_user_flag = (
        calendar_event_update.user_id != event.user_id
        or calendar_event_update.user_id is not None
    )
    logger.debug(f"{new_user_flag=}")
    if new_user_flag:
        new_receiver = crud.user.get(db, calendar_event_update.user_id)
        if not new_receiver:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Пользователь не найден"
            )
        # Change cuz later it will be used to check work time and other meetings
        event.user = new_receiver
        event.user_id = new_receiver.id

    # If only 1 of the dates is changed. check with val in db
    start = calendar_event_update.date_start
    end = calendar_event_update.date_end
    logger.debug("Checking if changed date is after or before stored date")
    if (
        bool(start) != bool(end)
        and (start and event.date_end <= start.replace(tzinfo=None))
        or (end and event.date_start >= end.replace(tzinfo=None))
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="date_start cant be smaller or equal to date_end",
        )

    if event.user.work_hours_end and event.user.work_hours_start:
        work_start_utc = convert_time_to_utc(
            event.user.work_hours_start, EKB_UTC_OFFSET
        )
        work_end_utc = convert_time_to_utc(event.user.work_hours_end, EKB_UTC_OFFSET)
        if work_start_utc > start.time() or work_end_utc < end.time():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User doesnt work at this time",
            )

    try:
        event = crud.calendar.update(db, db_obj=event, obj_in=calendar_event_update)
    except OverlappingEventError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either you, or event participant have overlapping event",
        )
    logger.debug("Updated calendar event")

    if new_user_flag:
        background_tasks.add_task(
            notifiers.send,
            event.user_id,
            f"{event.owner.full_name.title()} создал (-а) новую встречу",
            "calendar.create",
            db=db,
        )
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
            status_code=status.HTTP_403_FORBIDDEN,
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
    logger.debug(
        f"Getting events for {user_id=} with queries {date=} {format=} {status=}"
    )
    events = crud.calendar.get_with_common_queries(
        db, user_id=user_id, date=date, format=format, status=status
    )
    logger.debug(f"Found {events}")
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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    logger.debug(f"{curr_user.full_name} is trying to accept {event}")
    if event.status not in (
        schemas.CalendarEventStatus.PENDING,
        schemas.CalendarEventStatus.RESHEDULED,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action on this event already prefomed",
        )

    try:
        event = crud.calendar.accept(db, db_obj=event)
    except OverlappingEventError as e:
        logger.debug(f"Event(id={event.id}) users have overlapping events")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either you, or event participant have overlapping event",
        )

    background_tasks.add_task(
        notifiers.send,
        event.owner_id,
        f"{event.user.full_name.title()} принял (-а) вашу встречу",
        "calendar.accept",
        db=db,
    )
    logger.debug("Event accepted")
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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    logger.debug(f"{curr_user.full_name} is trying to reject {event})")
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
        f"{event.user.full_name.title()} отклонил (-а) вашу встречу",
        "calendar.reject",
        db=db,
    )
    logger.debug("Event rejected")
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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    logger.debug(
        f"{curr_user.full_name} is trying to reshedule {event} to {resheduled_event}"
    )
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

    try:
        event = crud.calendar.reshedule(db, db_obj=event, resheduled=resheduled_event)
    except OverlappingEventError:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either you, or event participant have overlapping event",
        )

    background_tasks.add_task(
        notifiers.send,
        event.user_id,
        f"{event.owner.full_name.title()} перенес (-ла) вашу встречу",
        "calendar.reshedule",
        db=db,
    )
    logger.debug("Event resheduled")
    return event


def convert_time_to_utc(time: time, offset: int) -> time:
    return (datetime.combine(date.today(), time) - timedelta(hours=offset)).time()
