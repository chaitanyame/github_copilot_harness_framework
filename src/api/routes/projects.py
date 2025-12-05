# src/api/routes/projects.py
"""Projects API endpoints."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from src.config import settings
from src.models.project import ProjectCreate, ProjectStatus
from src.models.responses import (
    ErrorResponse,
    PaginationMeta,
    ProjectListResponse,
    ProjectResponse,
)
from src.services.project_service import ProjectService

router = APIRouter()


@router.get(
    "",
    response_model=ProjectListResponse,
    summary="List all projects",
    description="Get a paginated list of projects with optional status filtering.",
)
def list_projects(
    status: Optional[ProjectStatus] = Query(
        default=None,
        description="Filter by project status",
    ),
    limit: int = Query(
        default=settings.default_limit,
        ge=1,
        le=settings.max_limit,
        description=f"Maximum number of projects to return (1-{settings.max_limit})",
    ),
    offset: int = Query(
        default=0,
        ge=0,
        description="Number of projects to skip",
    ),
) -> ProjectListResponse:
    """List all projects with pagination and optional filtering."""
    service = ProjectService()
    projects, total = service.get_all(status=status, limit=limit, offset=offset)

    return ProjectListResponse(
        data=projects,
        meta=PaginationMeta(total=total, limit=limit, offset=offset),
    )


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Project not found"},
    },
    summary="Get a project by ID",
    description="Retrieve a single project by its unique identifier.",
)
def get_project(project_id: UUID) -> ProjectResponse:
    """Get a single project by ID."""
    service = ProjectService()
    project = service.get_by_id(project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "not_found",
                "message": f"Project with ID '{project_id}' not found",
            },
        )

    return ProjectResponse(data=project)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        422: {"model": ErrorResponse, "description": "Validation error"},
    },
    summary="Create a new project",
    description="Create a new project with the provided data.",
)
def create_project(project_data: ProjectCreate) -> ProjectResponse:
    """Create a new project."""
    service = ProjectService()
    project = service.create(project_data)

    return ProjectResponse(data=project)
