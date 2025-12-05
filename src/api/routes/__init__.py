# src/api/routes/__init__.py
"""API route definitions."""

from fastapi import APIRouter

from src.api.routes.projects import router as projects_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(projects_router, prefix="/projects", tags=["projects"])
