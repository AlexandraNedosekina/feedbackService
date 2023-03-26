import logging

from fastapi import APIRouter, Depends, HTTPException, Response, status

from feedback import crud, schemas
from feedback.api.deps import GetUserWithRoles, get_current_user, get_db

log = logging.getLogger(__name__)
get_admin_boss_manager_hr = GetUserWithRoles(["admin", "boss", "manager", "hr"])
router = APIRouter(dependencies=[Depends(get_admin_boss_manager_hr)])


@router.get("/{template_id}", response_model=schemas.CareerTemplate)
def get_template_by_id(template_id: int, db=Depends(get_db)):
    log.debug(f"Get template with {template_id=}")
    template = crud.career_template.get(db, id=template_id)
    if not template:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Template not found")
    log.debug(f"Found template {template=}")
    return template


@router.post("/", response_model=schemas.CareerTemplate)
def create_template(
    template_create: schemas.CareerTemplateCreate,
    curr_user=Depends(get_current_user),
    db=Depends(get_db),
):
    log.debug(f"Creating template {template_create=}")
    template = crud.career_template.create(
        db, obj_in=template_create, creator_id=curr_user.id
    )
    log.debug("Template created")
    return template


@router.get("/", response_model=list[schemas.CareerTemplate])
def get_templates(
    by: int | None = None,
    name: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db=Depends(get_db),
):
    log.debug(f"Getting templates with query: {name=}, {by=}, {skip=}, {limit=}")
    return crud.career_template.get_multi_with_queries(
        db, by=by, name=name, skip=skip, limit=limit
    )


@router.put("/{template_id}", response_model=schemas.CareerTemplate)
def update_whole_template(
    template_id: int,
    template_update: schemas.CareerTemplateUpdate,
    curr_user=Depends(get_current_user),
    db=Depends(get_db),
):
    template = crud.career_template.get(db, template_id)
    if not template:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Template not found")

    if "admin" not in curr_user.get_roles or template.created_by_id != curr_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "You can't delete that template")

    template = crud.career_template.update(db, db_obj=template, obj_in=template_update)
    log.debug(f"Template {template.id} updated by {curr_user.id}")
    return template


@router.delete("/{template_id}")
def delete_template(
    template_id: int, curr_user=Depends(get_current_user), db=Depends(get_db)
):
    template = crud.career_template.get(db, template_id)
    if not template:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Template not found")

    if "admin" not in curr_user.get_roles or template.created_by_id != curr_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "You can't delete that template")

    crud.career_template.remove(db, id=template_id)

    log.debug(f"Template with id {template_id} deleted by {curr_user.id}")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
