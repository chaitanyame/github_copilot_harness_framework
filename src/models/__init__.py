# src/models/__init__.py
"""Pydantic models for the Projects API."""

from src.models.project import (
    Project,
    ProjectCreate,
    ProjectStatus,
    ProjectUpdate,
)
from src.models.responses import (
    ErrorDetail,
    ErrorResponse,
    PaginationMeta,
    ProjectListResponse,
    ProjectResponse,
    ResponseMeta,
)

__all__ = [
    # Project models
    "Project",
    "ProjectCreate",
    "ProjectUpdate",
    "ProjectStatus",
    # Response models
    "ResponseMeta",
    "PaginationMeta",
    "ProjectResponse",
    "ProjectListResponse",
    "ErrorDetail",
    "ErrorResponse",
]
