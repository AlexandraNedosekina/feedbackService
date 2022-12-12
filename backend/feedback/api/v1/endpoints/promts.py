from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.encoders import jsonable_encoder
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import GetUserWithRoles, get_current_user, get_db

router = APIRouter()

get_admin = GetUserWithRoles(["admin"])


@router.get("/full_name", response_model=list[schemas.User])
async def get_full_name_promts(
    q: str = Query(default="", description="part of name"),
    _: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    search = "%{}%".format(q)
    list_of_users_promts = (
        db.query(models.User).filter(models.User.full_name.ilike(search)).all()
    )
    return list_of_users_promts


@router.get("/skills", response_model=list[schemas.ShowSkillPromts])
async def get_skills_promts(
    q: str = Query(default="", description="part of skill"),
    _: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    search = "%{}%".format(q)
    list_of_promts = (
        db.query(models.SkillPromts).filter(models.SkillPromts.name.ilike(search)).all()
    )
    return list_of_promts


@router.post("/skills")
async def add_skills_promts(
    skills_promts: schemas.AddSkillPromts,
    _: models.User = Depends(get_admin),
    db: Session = Depends(get_db),
) -> HTMLResponse:
    try:
        skills = jsonable_encoder(skills_promts)
        for skill in skills.get("name"):
            # исключение дубликатов
            if (
                db.query(models.SkillPromts)
                .filter(models.SkillPromts.name == skill)
                .first()
            ):
                continue
            obj_to_add = models.SkillPromts(name=skill)
            db.add(obj_to_add)
            db.commit()
            db.refresh(obj_to_add)
    except Exception as e:
        return HTMLResponse(headers={"exception": repr(e)})
    return HTMLResponse(status_code=200)


@router.delete("/skills/all")
async def delete_all_skill_promts(
    _: models.User = Depends(get_admin), db: Session = Depends(get_db)
) -> HTMLResponse:
    db.query(models.SkillPromts).delete()
    db.commit()
    return HTMLResponse("All rows from table 'SkillPromts' were deleted")
