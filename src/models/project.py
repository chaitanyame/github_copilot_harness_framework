# src/models/project.py
"""Pydantic models for Project entity."""

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProjectStatus(str, Enum):
    """Project status enumeration."""

    ACTIVE = "active"
    ARCHIVED = "archived"


class ProjectBase(BaseModel):
    """Base model with common project fields."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Project name (1-100 characters)",
        examples=["My Awesome Project"],
    )
    description: str = Field(
        default="",
        max_length=1000,
        description="Project description (0-1000 characters)",
        examples=["A sample project for demonstration"],
    )
    status: ProjectStatus = Field(
        default=ProjectStatus.ACTIVE,
        description="Project status",
        examples=[ProjectStatus.ACTIVE],
    )
    owner: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Project owner username (1-100 characters)",
        examples=["john.doe"],
    )


class ProjectCreate(ProjectBase):
    """Request model for creating a new project."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "My New Project",
                "description": "A project to demonstrate the API",
                "status": "active",
                "owner": "john.doe",
            }
        }
    )


class ProjectUpdate(BaseModel):
    """Request model for updating an existing project.

    All fields are optional - only provided fields will be updated.
    """

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Project name (1-100 characters)",
        examples=["Updated Project Name"],
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Project description (0-1000 characters)",
        examples=["Updated description"],
    )
    status: Optional[ProjectStatus] = Field(
        default=None,
        description="Project status",
        examples=[ProjectStatus.ARCHIVED],
    )
    owner: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Project owner username (1-100 characters)",
        examples=["jane.doe"],
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Updated Project Name",
                "status": "archived",
            }
        }
    )


class Project(ProjectBase):
    """Complete project model with all fields including server-generated ones."""

    id: UUID = Field(
        ...,
        description="Unique project identifier",
        examples=["123e4567-e89b-12d3-a456-426614174000"],
    )
    created_at: datetime = Field(
        ...,
        description="Timestamp when the project was created",
        examples=["2024-01-15T10:30:00Z"],
    )
    updated_at: datetime = Field(
        ...,
        description="Timestamp when the project was last updated",
        examples=["2024-01-20T14:45:00Z"],
    )

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Sample Project",
                "description": "A sample project for demonstration",
                "status": "active",
                "owner": "john.doe",
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-20T14:45:00Z",
            }
        },
    )
