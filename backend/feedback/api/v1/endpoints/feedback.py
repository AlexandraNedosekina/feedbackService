from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from feedback.api.deps import get_db
from feedback import crud, schemas, models

router = APIRouter()

#todo необходимо сделать так, чтобы при обновлении коллег (например кого-то удалили) у удалённого пользователя (тот, который есть в старом списке, но его нет в новом)
#   происходило удаление конкретного юзера из списка. Т.е. новый список без этого. Или можно удалить запись с ним и данными из бд...
#  Либо необходимо разделить метод patch на post и delete с


@router.get("/{user_id}") #response_model=list[schemas.Colleagues]
async def get_colleagues_by_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="No user with such id")
    collegues = user.colleagues
    return collegues


@router.post("/{user_id}")  # response_model=schemas.UserShowColleagues
async def add_user_colleagues(user_id: int, colleagues_ids: schemas.ColleaguesIdList, db: Session = Depends(get_db)):
    upd_user_colls = []
    upd_colls_list = []
    colleagues_ids = colleagues_ids.colleagues_ids
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="No user with such id")

    for coll_id in colleagues_ids:
        if coll_id == user_id:
            raise HTTPException(status_code=404, detail=f"Can not add colleague with users(self) id - {coll_id}")
        colleague = crud.user.get(db, coll_id)
        if not colleague:
            raise HTTPException(status_code=404, detail=f"No user with such id - {colleague}")

        #Add colleague to user and user to colleague
        upd_user_colls.append(models.Colleagues(colleague_id=coll_id, owner_id=user_id))

        colleague.colleagues = [models.Colleagues(colleague_id=user_id, owner_id=coll_id)]
        upd_colls_list.append(colleague)

    user.colleagues = upd_user_colls

    db.add(user)
    db.add_all(upd_colls_list)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/user_id")
async def delete_user_colleagues(user_id: int, colleagues_ids: schemas.ColleaguesIdList, db: Session = Depends(get_db)):
    to_delete_colleagues_ids = colleagues_ids.colleagues_ids
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="No user with such id")


    user_colleagues_ids = db.query(user.colleagues.colleague_id).all()

    for coll_id in to_delete_colleagues_ids:
        if coll_id == user_id:
            raise HTTPException(status_code=404, detail=f"Can not delete colleague with users(self) id - {coll_id}")
        colleague = crud.user.get(db, coll_id)
        if not colleague:
            raise HTTPException(status_code=404, detail=f"No user with such id - {colleague}")

        if coll_id not in user_colleagues_ids:
            raise HTTPException(status_code=404, detail=f"User has no colleague with id {colleague} to be deleted")


        #нужно получить id связи для пользователя и
        delete_user_relation = db.query(user).filter(user.colleagues.colleague_id == coll_id).first()
        delete_colleague_relation = db.query(colleague).filter(colleague.colleagues.colleague_id == user_id).first()

        db.delete(delete_user_relation)
        db.delete(delete_colleague_relation)

    db.commit()
    db.refresh(user)
    return user