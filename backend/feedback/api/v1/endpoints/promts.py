from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.api.deps import get_current_user, get_db

router = APIRouter()


@router.get("/full_name", response_model=list[schemas.User])
async def get_full_name_promts(
    q: str = Query(...),
    _: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns list of users with similar name
    """
    search = "%{}%".format(q)
    list_of_users_promts = (
        db.query(models.User).filter(models.User.full_name.ilike(search)).all()
    )
    return list_of_users_promts


@router.get("/skills", response_model=list[str])
async def get_skills_promts(
    q: str = Query(...),
    _: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns list of skills similar to provided query
    """
    search = "%{}%".format(q)
    list_of_promts = (
        db.query(models.Skills).filter(models.Skills.description.ilike(search)).all()
    )
    return [s.description for s in list_of_promts]
