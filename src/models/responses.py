# src/models/responses.py
"""Standardized response wrapper models."""

from datetime import datetime, timezone
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field

from src.models.project import Project

T = TypeVar("T")


class ResponseMeta(BaseModel):
    """Metadata for single-item responses."""

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Response timestamp in UTC",
    )


class PaginationMeta(BaseModel):
    """Metadata for paginated list responses."""

    total: int = Field(..., ge=0, description="Total number of items")
    limit: int = Field(..., ge=1, le=100, description="Maximum items per page")
    offset: int = Field(..., ge=0, description="Number of items skipped")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Response timestamp in UTC",
    )


class ProjectResponse(BaseModel):
    """Response wrapper for a single project."""

    data: Project = Field(..., description="The project data")
    meta: ResponseMeta = Field(
        default_factory=ResponseMeta,
        description="Response metadata",
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "data": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "name": "Sample Project",
                    "description": "A sample project",
                    "status": "active",
                    "owner": "john.doe",
                    "created_at": "2024-01-15T10:30:00Z",
                    "updated_at": "2024-01-20T14:45:00Z",
                },
                "meta": {"timestamp": "2024-01-20T15:00:00Z"},
            }
        }
    )


class ProjectListResponse(BaseModel):
    """Response wrapper for a list of projects."""

    data: List[Project] = Field(..., description="List of projects")
    meta: PaginationMeta = Field(..., description="Pagination metadata")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "data": [
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "name": "Project Alpha",
                        "description": "First project",
                        "status": "active",
                        "owner": "john.doe",
                        "created_at": "2024-01-15T10:30:00Z",
                        "updated_at": "2024-01-20T14:45:00Z",
                    }
                ],
                "meta": {
                    "total": 1,
                    "limit": 20,
                    "offset": 0,
                    "timestamp": "2024-01-20T15:00:00Z",
                },
            }
        }
    )


class ErrorDetail(BaseModel):
    """Detailed error information."""

    field: Optional[str] = Field(
        default=None,
        description="The field that caused the error (if applicable)",
    )
    message: str = Field(..., description="Human-readable error message")
    code: Optional[str] = Field(
        default=None,
        description="Machine-readable error code",
    )


class ErrorResponse(BaseModel):
    """Standardized error response format."""

    error: str = Field(..., description="Error type/category")
    message: str = Field(..., description="Human-readable error message")
    details: Optional[List[ErrorDetail]] = Field(
        default=None,
        description="Detailed error information for validation errors",
    )
    meta: ResponseMeta = Field(
        default_factory=ResponseMeta,
        description="Response metadata",
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "error": "validation_error",
                "message": "Request validation failed",
                "details": [
                    {
                        "field": "name",
                        "message": "String should have at least 1 character",
                        "code": "string_too_short",
                    }
                ],
                "meta": {"timestamp": "2024-01-20T15:00:00Z"},
            }
        }
    )
