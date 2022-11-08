import json

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import HTMLResponse
from feedback import crud, models, schemas
from feedback.api.deps import get_db
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from feedback.api.deps import GetUserWithRoles

router = APIRouter()

get_admin = GetUserWithRoles(["admin"])

@router.get("/", response_model=list[schemas.ShowSkillPromts])
async def get_skills_promts(q: str = "", db: Session = Depends(get_db)):
    search = "%{}%".format(q)
    list_of_promts = db.query(models.SkillPromts).filter(models.SkillPromts.name.ilike(search)).all()
    return list_of_promts


@router.post("/")
async def add_skills_promts(
        skills_promts: schemas.AddSkillPromts,
        _: models.User = Depends(get_admin),
        db: Session = Depends(get_db)) -> HTMLResponse():
    try:
        skills = jsonable_encoder(skills_promts)
        for skill in skills.get("name"):
            # исключение дубликатов
            if db.query(models.SkillPromts).filter(models.SkillPromts.name == skill).first():
                continue
            obj_to_add = models.SkillPromts(name=skill)
            db.add(obj_to_add)
            db.commit()
            db.refresh(obj_to_add)
    except Exception as e:
        return HTMLResponse(headers={"exception": repr(e)})
    return HTMLResponse(status_code=200)


@router.delete("/all")
async def delete_all_hints(
        _: models.User = Depends(get_admin),
        db: Session = Depends(get_db)) -> HTMLResponse():
    db.query(models.SkillPromts).delete()
    db.commit()
    return HTMLResponse("all rows from table 'SkillPromts' were deleted")

