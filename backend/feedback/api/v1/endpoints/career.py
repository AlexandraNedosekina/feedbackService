import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import GetUserWithRoles, get_current_user, get_db

logger = logging.getLogger(__name__)
get_admin_boss_manager = GetUserWithRoles(["admin", "boss", "manager"])
get_admin_boss_manager_hr = GetUserWithRoles(["admin", "boss", "manager", "hr"])
router = APIRouter()


@router.get(
    "/",
    response_model=list[schemas.CareerTrack],
)
async def get_all_career_tracks(
    skip: int = 0,
    limit: int = 100,
    user_id: int = Query(None, description="Optional query to filter by user_id"),
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager_hr),
):
    return crud.career.get_multi(db, skip=skip, limit=limit, user_id=user_id)


@router.get("/me", response_model=list[schemas.CareerTrack])
async def get_current_user_career_tracks(
    db: Session = Depends(get_db), curr_user: models.User = Depends(get_current_user)
):
    return crud.career.get_multi(db, user_id=curr_user.id, skip=0, limit=9999)


@router.get("/{career_id}", response_model=schemas.CareerTrack)
async def get_career_by_id(
    career_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager_hr),
):
    career_track = crud.career.get(db, id=career_id)
    if not career_track:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, detail="Карьерный путь не найден"
        )
    return career_track


@router.post("/", response_model=schemas.CareerTrack)
async def create_career_track(
    career_create: schemas.CareerTrackCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    career = crud.career.create(db, obj_in=career_create)
    return career


@router.patch("/{career_id}", response_model=schemas.CareerTrack)
async def update_career_track(
    career_id: int,
    career_update: schemas.CareerTrackUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    career = crud.career.get(db, id=career_id)
    if not career:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, detail="Карьерный путь не найден"
        )

    return crud.career.update(db, db_obj=career, obj_in=career_update)


@router.delete("/{career_id}")
async def delete_career_track(
    career_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    career_track = crud.career.get(db, id=career_id)
    if not career_track:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, detail="Карьерный путь не найден"
        )
    crud.career.remove(db, id=career_id)
    return Response(status_code=204)


@router.post("/{career_id}/params", response_model=schemas.CareerTrack)
async def add_params(
    career_id: int,
    param_create: list[schemas.CareerParamCreate],
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    career = crud.career.get(db, id=career_id)
    if not career:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, detail="Карьерный путь не найден"
        )
    career = crud.career.add_params(db, career=career, obj_in=param_create)
    return career


@router.delete("/params/{param_id}")
async def remove_param(
    param_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    param = crud.career.get_param(db, param_id)
    if not param:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Этап не найден")

    crud.career.remove_param(db, id=param_id)
    return Response(status_code=204)
