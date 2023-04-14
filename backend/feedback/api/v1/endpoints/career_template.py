import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
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


@router.post("/{template_id}/apply")
def apply_template(
    template_id: int,
    apply_options: schemas.ApplyTemplateOpts,
    background_tasks: BackgroundTasks,
    db=Depends(get_db),
):
    template = crud.career_template.get(db, template_id)
    if not template:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    log.debug(f"Apply template id={template_id}, opts={apply_options}")

    # Check users exist
    for uid in apply_options.user_ids:
        user = crud.user.get(db, uid)
        if not user:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, f"User with id {uid} does not exist"
            )
    log.debug("Users exist")

    # Check indexes are inrange
    if apply_options.indexes and any(
        i > len(template.template) - 1 for i in apply_options.indexes
    ):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Index is out of range")
    log.debug("Indexes are ok")

    background_tasks.add_task(constuct_and_create_tracks, apply_options, template, db)
    log.debug("Added bg task")
    return {"result": "ok"}


def constuct_and_create_tracks(
    apply_options: schemas.ApplyTemplateOpts,
    template: models.CareerTemplate,
    db: Session,
):
    indexes = apply_options.indexes or list(range(len(template.template)))
    log.debug(f"Indexes = {indexes}")

    career_tracks = []
    for i in indexes:
        for uid in apply_options.user_ids:
            obj_in = schemas.CareerTrackCreate(**template.template[i], user_id=uid)
            career_tracks.append(obj_in)
    log.debug(f"{career_tracks=}")

    crud.career.bulk_create(db, objs_in=career_tracks)
    log.debug(f"Created {len(indexes) * len(apply_options.user_ids)} tracks")
