from fastapi import APIRouter

from feedback.api.v1.endpoints import auth, avatar, feedback, promts, user

api_router = APIRouter()

api_router.include_router(avatar.router, prefix="/user", tags=["avatar"])
api_router.include_router(user.router, prefix="/user", tags=["users"])
api_router.include_router(promts.router, prefix="/promts", tags=["promts"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
