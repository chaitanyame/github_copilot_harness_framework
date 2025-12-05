# Task List

**Feature Branch**: `001-projects-api`  
**Generated from**: [plan.md](plan.md)  
**Date**: 2024-12-04

---

## Overview

| Metric | Value |
|--------|-------|
| **Total Tasks** | 34 |
| **High Priority (P1)** | 18 |
| **Medium Priority (P2)** | 12 |
| **Low Priority (P3)** | 4 |
| **Estimated Sessions** | 6-7 |

---

## Quick Reference

| ID | Task | Priority | Complexity | Status |
|----|------|----------|------------|--------|
| T001 | Initialize Python project | P1 | Low | ⬜ Not Started |
| T002 | Create Project Pydantic models | P1 | Medium | ⬜ Not Started |
| T003 | Create response wrapper models | P1 | Low | ⬜ Not Started |
| T004 | Implement MockDataStore | P1 | Medium | ⬜ Not Started |
| T005 | Create seed data generator | P1 | Medium | ⬜ Not Started |
| T006 | Create FastAPI app with CORS | P1 | Low | ⬜ Not Started |
| T007 | Implement GET /projects (list) | P1 | Medium | ⬜ Not Started |
| T008 | Implement GET /projects/{id} | P1 | Low | ⬜ Not Started |
| T009 | Implement POST /projects | P1 | Medium | ⬜ Not Started |
| T010 | Implement PUT /projects/{id} | P1 | Medium | ⬜ Not Started |
| T011 | Implement DELETE /projects/{id} | P1 | Low | ⬜ Not Started |
| T012 | Add status filter query param | P2 | Low | ⬜ Not Started |
| T013 | Create custom exception classes | P1 | Low | ⬜ Not Started |
| T014 | Implement error handler middleware | P1 | Medium | ⬜ Not Started |
| T015 | Format validation errors (422) | P1 | Medium | ⬜ Not Started |
| T016 | Handle 404 Not Found | P2 | Low | ⬜ Not Started |
| T017 | Add validation edge cases | P2 | Medium | ⬜ Not Started |
| T018 | Implement /health endpoint | P2 | Low | ⬜ Not Started |
| T019 | Configure OpenAPI metadata | P2 | Low | ⬜ Not Started |
| T020 | Export OpenAPI spec to file | P3 | Low | ⬜ Not Started |
| T021 | Verify Swagger UI functionality | P3 | Low | ⬜ Not Started |
| T022 | Set up pytest with fixtures | P1 | Low | ⬜ Not Started |
| T023 | Write model unit tests | P2 | Medium | ⬜ Not Started |
| T024 | Write data store unit tests | P2 | Medium | ⬜ Not Started |
| T025 | Write CRUD integration tests | P1 | High | ⬜ Not Started |
| T026 | Write error handling tests | P2 | Medium | ⬜ Not Started |
| T027 | Write pagination/filter tests | P2 | Medium | ⬜ Not Started |
| T028 | Write edge case tests | P2 | Medium | ⬜ Not Started |
| T029 | Verify 90%+ test coverage | P1 | Low | ⬜ Not Started |
| T030 | Create Dockerfile | P2 | Low | ⬜ Not Started |
| T031 | Create docker-compose.yml | P3 | Low | ⬜ Not Started |
| T032 | Create .dockerignore | P3 | Low | ⬜ Not Started |
| T033 | Test container build and run | P2 | Low | ⬜ Not Started |
| T034 | Document Docker usage in README | P2 | Low | ⬜ Not Started |

---

## Detailed Tasks

### Category: Foundation (Phase 1)

---

#### T001: Initialize Python Project with Dependencies

| Property | Value |
|----------|-------|
| **ID** | T001 |
| **Priority** | P1 (High) |
| **Complexity** | Low |
| **Depends On** | None |
| **Estimated Effort** | 0.5 session |

**Description**

Set up the Python project structure with all required dependencies. Create the package layout, configuration files, and install development tools.

**Acceptance Criteria**

- [ ] `pyproject.toml` or `requirements.txt` created with all dependencies
- [ ] Project structure created (`src/`, `tests/` directories)
- [ ] Virtual environment can be created and activated
- [ ] `pip install -r requirements.txt` succeeds
- [ ] Basic `src/__init__.py` and `src/main.py` exist

**Files to Create**

| File | Purpose |
|------|---------|
| `requirements.txt` | Production dependencies |
| `requirements-dev.txt` | Development dependencies |
| `pyproject.toml` | Project metadata and tool config |
| `src/__init__.py` | Package marker |
| `src/main.py` | Entry point placeholder |
| `.gitignore` | Python ignores |

**Testing Notes**

```bash
# Verify setup
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -c "import fastapi; print(fastapi.__version__)"
```

**Implementation Hints**

- Use Python 3.11+ features
- Include: fastapi, uvicorn[standard], pydantic>=2.5.0
- Dev deps: pytest, pytest-cov, httpx, ruff, black

---

#### T002: Create Project Pydantic Models

| Property | Value |
|----------|-------|
| **ID** | T002 |
| **Priority** | P1 (High) |
| **Complexity** | Medium |
| **Depends On** | T001 |
| **Estimated Effort** | 1 session |

**Description**

Create Pydantic v2 models for the Project entity, including validation rules for all fields. Models should handle creation, update, and database representation.

**Acceptance Criteria**

- [ ] `Project` model with all 7 fields defined
- [ ] `ProjectCreate` request model with validation
- [ ] `ProjectUpdate` request model with validation
- [ ] `ProjectStatus` enum (active, archived)
- [ ] Field validation: name (1-100 chars), description (0-1000 chars)
- [ ] UUID validation for id field
- [ ] Datetime fields use ISO 8601 format

**Files to Create**

| File | Purpose |
|------|---------|
| `src/models/__init__.py` | Package marker |
| `src/models/project.py` | Project models and enums |

**Testing Notes**

```python
# Quick validation test
from src.models.project import ProjectCreate
p = ProjectCreate(name="Test", owner="user_001")
assert p.status == "active"  # default value
```

**Implementation Hints**

```python
from pydantic import BaseModel, Field
from enum import Enum

class ProjectStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(default="", max_length=1000)
    status: ProjectStatus = Field(default=ProjectStatus.ACTIVE)
    owner: str = Field(..., min_length=1)
```

---

#### T003: Create Response Wrapper Models

| Property | Value |
|----------|-------|
| **ID** | T003 |
| **Priority** | P1 (High) |
| **Complexity** | Low |
| **Depends On** | T002 |
| **Estimated Effort** | 0.5 session |

**Description**

Create standardized response wrapper models following the constitution's response format. All API responses should use these wrappers for consistency.

**Acceptance Criteria**

- [ ] `ResponseMeta` model with timestamp
- [ ] `PaginationMeta` model with total, limit, offset, timestamp
- [ ] `ProjectResponse` wrapper for single project
- [ ] `ProjectListResponse` wrapper for project list
- [ ] `ErrorDetail` model for error info
- [ ] `ErrorResponse` model matching spec format
- [ ] Generic typing support for reusability

**Files to Create**

| File | Purpose |
|------|---------|
| `src/models/responses.py` | Response wrapper models |

**Testing Notes**

```python
from src.models.responses import ProjectResponse
from src.models.project import Project

response = ProjectResponse(
    data=project,
    meta={"timestamp": "2024-12-04T10:00:00Z"}
)
```

**Implementation Hints**

```python
from typing import Generic, TypeVar, List
from pydantic import BaseModel
from datetime import datetime

T = TypeVar("T")

class SuccessResponse(BaseModel, Generic[T]):
    data: T
    meta: ResponseMeta
```

---

#### T004: Implement MockDataStore Class

| Property | Value |
|----------|-------|
| **ID** | T004 |
| **Priority** | P1 (High) |
| **Complexity** | Medium |
| **Depends On** | T002 |
| **Estimated Effort** | 1 session |

**Description**

Create an in-memory data store using a dictionary to store projects. Implement singleton pattern so the same store is used across all requests. Include all CRUD operations.

**Acceptance Criteria**

- [ ] Singleton pattern implemented correctly
- [ ] `get_all(status, limit, offset)` with filtering and pagination
- [ ] `get_by_id(id)` returns project or None
- [ ] `create(project)` adds project with generated ID and timestamps
- [ ] `update(id, data)` updates project and updated_at timestamp
- [ ] `delete(id)` removes project, returns bool
- [ ] `count(status)` returns total matching projects
- [ ] Thread-safe operations (basic)

**Files to Create**

| File | Purpose |
|------|---------|
| `src/data/__init__.py` | Package marker |
| `src/data/store.py` | MockDataStore class |

**Testing Notes**

```python
store = MockDataStore.get_instance()
project = store.create(ProjectCreate(name="Test", owner="user_001"))
assert store.get_by_id(project.id) is not None
```

**Implementation Hints**

```python
from typing import Dict, Optional, List
import uuid
from datetime import datetime, timezone

class MockDataStore:
    _instance: Optional["MockDataStore"] = None
    _projects: Dict[str, Project] = {}
    
    @classmethod
    def get_instance(cls) -> "MockDataStore":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    @classmethod
    def reset(cls) -> None:
        """Reset for testing"""
        cls._instance = None
        cls._projects = {}
```

---

#### T005: Create Seed Data Generator

| Property | Value |
|----------|-------|
| **ID** | T005 |
| **Priority** | P1 (High) |
| **Complexity** | Medium |
| **Depends On** | T004 |
| **Estimated Effort** | 1 session |

**Description**

Create a seed data generator that populates the MockDataStore with 50+ realistic projects on startup. Distribute projects across multiple owners with varied statuses and timestamps.

**Acceptance Criteria**

- [ ] Generates 52 projects (exceeds 50 requirement)
- [ ] 8-10 unique owners with realistic distribution
- [ ] ~70% active, ~30% archived status distribution
- [ ] Realistic project names (not "Project 1", "Project 2")
- [ ] Dates spread across past 12 months
- [ ] `updated_at` always >= `created_at`
- [ ] Deterministic generation (same data each run for testing)
- [ ] `seed_data()` function callable from app startup

**Files to Create**

| File | Purpose |
|------|---------|
| `src/data/seed.py` | Seed data generator |

**Testing Notes**

```python
from src.data.seed import seed_data
from src.data.store import MockDataStore

seed_data()
store = MockDataStore.get_instance()
assert store.count() >= 50
assert store.count(status="active") > store.count(status="archived")
```

**Implementation Hints**

```python
# Sample project names
PROJECT_NAMES = [
    "Website Redesign 2024",
    "Mobile App v2.0", 
    "Customer Portal",
    "API Gateway Migration",
    "Data Analytics Dashboard",
    # ... 50+ names
]

# Owner distribution
OWNERS = [
    ("user_001", "Alice Johnson", 12),
    ("user_002", "Bob Smith", 8),
    # ...
]
```

---

### Category: Core API (Phase 2)

---

#### T006: Create FastAPI App with CORS Middleware

| Property | Value |
|----------|-------|
| **ID** | T006 |
| **Priority** | P1 (High) |
| **Complexity** | Low |
| **Depends On** | T001 |
| **Estimated Effort** | 0.5 session |

**Description**

Create the main FastAPI application with CORS middleware configured for development use. Set up the app with proper metadata for OpenAPI documentation.

**Acceptance Criteria**

- [ ] FastAPI app created with title, description, version
- [ ] CORS middleware allows all origins (for demo)
- [ ] API versioning prefix `/api/v1`
- [ ] App runs with `uvicorn src.main:app`
- [ ] Root endpoint returns welcome message or redirects to docs
- [ ] Startup event seeds the data store

**Files to Modify/Create**

| File | Action | Purpose |
|------|--------|---------|
| `src/main.py` | Modify | FastAPI app setup |
| `src/config.py` | Create | Configuration settings |
| `src/api/__init__.py` | Create | Package marker |

**Testing Notes**

```bash
uvicorn src.main:app --reload
curl http://localhost:8000/
curl http://localhost:8000/docs
```

**Implementation Hints**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Projects API",
    description="RESTful API for managing projects",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

#### T007: Implement GET /projects (List with Pagination)

| Property | Value |
|----------|-------|
| **ID** | T007 |
| **Priority** | P1 (High) |
| **Complexity** | Medium |
| **Depends On** | T004, T006 |
| **Estimated Effort** | 1 session |

**Description**

Implement the list projects endpoint with pagination support. Handle `limit` and `offset` query parameters with proper defaults and validation.

**Acceptance Criteria**

- [ ] `GET /api/v1/projects` returns paginated list
- [ ] Default limit=10, offset=0
- [ ] `limit` capped at 100
- [ ] `offset` minimum 0
- [ ] Response includes `meta.total` with full count
- [ ] Response includes `meta.limit` and `meta.offset`
- [ ] Empty list returns `{"data": [], "meta": {...}}`

**Files to Create**

| File | Purpose |
|------|---------|
| `src/api/routes/__init__.py` | Package marker |
| `src/api/routes/projects.py` | Project route handlers |
| `src/services/__init__.py` | Package marker |
| `src/services/project_service.py` | Business logic |

**Testing Notes**

```bash
curl http://localhost:8000/api/v1/projects
curl "http://localhost:8000/api/v1/projects?limit=5&offset=10"
```

**Implementation Hints**

```python
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])

@router.get("", response_model=ProjectListResponse)
def list_projects(
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    ...
```

---

#### T008: Implement GET /projects/{id}

| Property | Value |
|----------|-------|
| **ID** | T008 |
| **Priority** | P1 (High) |
| **Complexity** | Low |
| **Depends On** | T004, T006 |
| **Estimated Effort** | 0.5 session |

**Description**

Implement the get single project endpoint. Return 404 if project not found.

**Acceptance Criteria**

- [ ] `GET /api/v1/projects/{id}` returns single project
- [ ] Valid UUID format required for id
- [ ] Returns 404 with error response if not found
- [ ] Response wrapped in standard format with `data` and `meta`

**Files to Modify**

| File | Action | Purpose |
|------|--------|---------|
| `src/api/routes/projects.py` | Modify | Add get endpoint |
| `src/services/project_service.py` | Modify | Add get_by_id method |

**Testing Notes**

```bash
# Get existing project
curl http://localhost:8000/api/v1/projects/{valid-uuid}

# Get non-existent project (should 404)
curl http://localhost:8000/api/v1/projects/00000000-0000-0000-0000-000000000000
```

**Implementation Hints**

```python
from uuid import UUID

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: UUID):
    project = service.get_by_id(str(project_id))
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse(data=project, meta=ResponseMeta())
```

---

#### T009: Implement POST /projects

| Property | Value |
|----------|-------|
| **ID** | T009 |
| **Priority** | P1 (High) |
| **Complexity** | Medium |
| **Depends On** | T004, T006 |
| **Estimated Effort** | 1 session |

**Description**

Implement the create project endpoint. Generate UUID, set timestamps, validate input, and return 201 Created with the new project.

**Acceptance Criteria**

- [ ] `POST /api/v1/projects` creates new project
- [ ] Returns 201 status code on success
- [ ] Auto-generates UUID for id
- [ ] Sets `created_at` and `updated_at` to current time
- [ ] Defaults `status` to "active" if not provided
- [ ] Defaults `description` to empty string if not provided
- [ ] Validates required fields (name, owner)
- [ ] Returns 422 for validation errors

**Files to Modify**

| File | Action | Purpose |
|------|--------|---------|
| `src/api/routes/projects.py` | Modify | Add create endpoint |
| `src/services/project_service.py` | Modify | Add create method |

**Testing Notes**

```bash
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "New Project", "owner": "user_001"}'
```

**Implementation Hints**

```python
from fastapi import status

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project_data: ProjectCreate):
    project = service.create(project_data)
    return ProjectResponse(data=project, meta=ResponseMeta())
```

---

#### T010: Implement PUT /projects/{id}

| Property | Value |
|----------|-------|
| **ID** | T010 |
| **Priority** | P1 (High) |
| **Complexity** | Medium |
| **Depends On** | T004, T006 |
| **Estimated Effort** | 1 session |

**Description**

Implement the update project endpoint. Replace all fields with the provided data, update the `updated_at` timestamp, and return 404 if not found.

**Acceptance Criteria**

- [ ] `PUT /api/v1/projects/{id}` updates existing project
- [ ] Returns 200 with updated project on success
- [ ] Returns 404 if project not found
- [ ] Updates `updated_at` timestamp automatically
- [ ] Preserves original `created_at`
- [ ] Validates all fields (name, status, owner required)
- [ ] Returns 422 for validation errors

**Files to Modify**

| File | Action | Purpose |
|------|--------|---------|
| `src/api/routes/projects.py` | Modify | Add update endpoint |
| `src/services/project_service.py` | Modify | Add update method |

**Testing Notes**

```bash
curl -X PUT http://localhost:8000/api/v1/projects/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "status": "archived", "owner": "user_002"}'
```

---

#### T011: Implement DELETE /projects/{id}

| Property | Value |
|----------|-------|
| **ID** | T011 |
| **Priority** | P1 (High) |
| **Complexity** | Low |
| **Depends On** | T004, T006 |
| **Estimated Effort** | 0.5 session |

**Description**

Implement the delete project endpoint. Return 204 No Content on success, 404 if not found.

**Acceptance Criteria**

- [ ] `DELETE /api/v1/projects/{id}` removes project
- [ ] Returns 204 No Content on success (no body)
- [ ] Returns 404 if project not found
- [ ] Project is actually removed from store
- [ ] Subsequent GET returns 404

**Files to Modify**

| File | Action | Purpose |
|------|--------|---------|
| `src/api/routes/projects.py` | Modify | Add delete endpoint |
| `src/services/project_service.py` | Modify | Add delete method |

**Testing Notes**

```bash
# Delete project
curl -X DELETE http://localhost:8000/api/v1/projects/{id} -v
# Response should be 204 with no body

# Verify deleted
curl http://localhost:8000/api/v1/projects/{id}
# Should return 404
```

---

#### T012: Add Status Filter Query Parameter

| Property | Value |
|----------|-------|
| **ID** | T012 |
| **Priority** | P2 (Medium) |
| **Complexity** | Low |
| **Depends On** | T007 |
| **Estimated Effort** | 0.5 session |

**Description**

Add status filtering to the list projects endpoint. Allow filtering by `active` or `archived` status via query parameter.

**Acceptance Criteria**

- [ ] `?status=active` returns only active projects
- [ ] `?status=archived` returns only archived projects
- [ ] No status parameter returns all projects
- [ ] Invalid status value returns 422 error
- [ ] `meta.total` reflects filtered count
- [ ] Pagination works correctly with filter

**Files to Modify**

| File | Action | Purpose |
|------|--------|---------|
| `src/api/routes/projects.py` | Modify | Add status param |
| `src/services/project_service.py` | Modify | Add filtering logic |
| `src/data/store.py` | Modify | Filter in get_all |

**Testing Notes**

```bash
curl "http://localhost:8000/api/v1/projects?status=active"
curl "http://localhost:8000/api/v1/projects?status=archived"
curl "http://localhost:8000/api/v1/projects?status=invalid"  # Should 422
```

---

### Category: Error Handling (Phase 3)

---

#### T013: Create Custom Exception Classes

| Property | Value |
|----------|-------|
| **ID** | T013 |
| **Priority** | P1 (High) |
| **Complexity** | Low |
| **Depends On** | T006 |
| **Estimated Effort** | 0.5 session |

**Description**

Create custom exception classes for different error types. These will be caught by the error handler middleware and converted to standard error responses.

**Acceptance Criteria**

- [ ] `NotFoundException` for 404 errors
- [ ] `ValidationException` for 422 errors
- [ ] `BadRequestException` for 400 errors
- [ ] All exceptions include error code and message
- [ ] Support for field-level error details

**Files to Create**

| File | Purpose |
|------|---------|
| `src/api/exceptions.py` | Custom exception classes |

**Implementation Hints**

```python
class APIException(Exception):
    def __init__(self, code: str, message: str, status_code: int, details: list = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or []

class NotFoundException(APIException):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(
            code="NOT_FOUND",
            message=f"{resource} not found",
            status_code=404,
            details=[{"field": "id", "message": f"No {resource.lower()} exists with ID: {resource_id}"}]
        )
```

---

#### T014: Implement Error Handler Middleware

| Property | Value |
|----------|-------|
| **ID** | T014 |
| **Priority** | P1 (High) |
| **Complexity** | Medium |
| **Depends On** | T013 |
| **Estimated Effort** | 1 session |

**Description**

Create exception handlers that convert exceptions to standard error response format. Handle both custom exceptions and FastAPI's built-in validation errors.

**Acceptance Criteria**

- [ ] Custom exceptions return proper error response format
- [ ] `RequestValidationError` converted to 422 format
- [ ] Unhandled exceptions return 500 with generic message
- [ ] All error responses include `error.code`, `error.message`, `error.details`
- [ ] Error details are an array (even if empty)

**Files to Create**

| File | Purpose |
|------|---------|
| `src/api/middleware/__init__.py` | Package marker |
| `src/api/middleware/error_handler.py` | Exception handlers |

**Testing Notes**

```bash
# Trigger validation error
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{}'

# Should return 422 with field errors for name, owner
```

**Implementation Hints**

```python
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    details = [
        {"field": err["loc"][-1], "message": err["msg"]}
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={"error": {"code": "VALIDATION_ERROR", "message": "Invalid input data", "details": details}}
    )
```

---

#### T015: Format Validation Errors (422 Responses)

| Property | Value |
|----------|-------|
| **ID** | T015 |
| **Priority** | P1 (High) |
| **Complexity** | Medium |
| **Depends On** | T014 |
| **Estimated Effort** | 0.5 session |

**Description**

Ensure validation errors are formatted with field-level details. Multiple validation errors should all be included in a single response.

**Acceptance Criteria**

- [ ] Missing `name` shows "Name is required" or similar
- [ ] Missing `owner` shows "Owner is required" or similar
- [ ] Name > 100 chars shows length error
- [ ] Invalid status shows enum error
- [ ] Multiple errors returned in single response
- [ ] Field names match request body fields

**Files to Modify**

| File | Action | Purpose |
|------|--------|---------|
| `src/api/middleware/error_handler.py` | Modify | Improve error formatting |
| `src/models/project.py` | Modify | Add custom error messages |

**Testing Notes**

```bash
# Multiple validation errors
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "", "status": "invalid"}'

# Should show errors for: name (empty), owner (missing), status (invalid)
```

---

#### T016: Handle 404 Not Found Consistently

| Property | Value |
|----------|-------|
| **ID** | T016 |
| **Priority** | P2 (Medium) |
| **Complexity** | Low |
| **Depends On** | T014 |
| **Estimated Effort** | 0.5 session |

**Description**

Ensure all 404 errors use the standard error format with consistent messaging. Update GET, PUT, DELETE endpoints.

**Acceptance Criteria**

- [ ] GET /projects/{id} returns 404 in standard format
- [ ] PUT /projects/{id} returns 404 in standard format
- [ ] DELETE /projects/{id} returns 404 in standard format
- [ ] Error includes the requested ID in details
- [ ] Error code is "NOT_FOUND"

**Files to Modify**

| File | Action | Purpose |
|------|--------|---------|
| `src/api/routes/projects.py` | Modify | Use NotFoundException |

---

#### T017: Add Validation Edge Cases

| Property | Value |
|----------|-------|
| **ID** | T017 |
| **Priority** | P2 (Medium) |
| **Complexity** | Medium |
| **Depends On** | T015 |
| **Estimated Effort** | 0.5 session |

**Description**

Handle edge cases in validation: invalid JSON, invalid UUID format, boundary values for string lengths.

**Acceptance Criteria**

- [ ] Invalid JSON returns 400 Bad Request
- [ ] Invalid UUID format in path returns 422
- [ ] Name exactly 100 chars is valid
- [ ] Name with 101 chars is invalid
- [ ] Description exactly 1000 chars is valid
- [ ] Empty request body returns 422

**Files to Modify**

| File | Action | Purpose |
|------|--------|---------|
| `src/api/middleware/error_handler.py` | Modify | Handle JSON decode errors |

---

### Category: Health & Documentation (Phase 4)

---

#### T018: Implement /health Endpoint

| Property | Value |
|----------|-------|
| **ID** | T018 |
| **Priority** | P2 (Medium) |
| **Complexity** | Low |
| **Depends On** | T006 |
| **Estimated Effort** | 0.25 session |

**Description**

Create a simple health check endpoint for container orchestration and monitoring.

**Acceptance Criteria**

- [ ] `GET /health` returns 200 OK
- [ ] Response includes `status: "healthy"`
- [ ] Response includes `version` from app config
- [ ] Response includes `timestamp`
- [ ] Endpoint not under /api/v1 prefix

**Files to Create**

| File | Purpose |
|------|---------|
| `src/api/routes/health.py` | Health check endpoint |

**Testing Notes**

```bash
curl http://localhost:8000/health
# {"status": "healthy", "version": "1.0.0", "timestamp": "..."}
```

---

#### T019: Configure OpenAPI Metadata

| Property | Value |
|----------|-------|
| **ID** | T019 |
| **Priority** | P2 (Medium) |
| **Complexity** | Low |
| **Depends On** | T006 |
| **Estimated Effort** | 0.25 session |

**Description**

Configure complete OpenAPI metadata including title, description, version, contact info, and tags.

**Acceptance Criteria**

- [ ] Title: "Projects API"
- [ ] Description explains the API purpose
- [ ] Version: "1.0.0"
- [ ] Tags documented for "Projects" and "Health"
- [ ] Servers include localhost development server
- [ ] All endpoints have operation IDs

**Files to Modify**

| File | Action | Purpose |
|------|--------|---------|
| `src/main.py` | Modify | Add OpenAPI config |

---

#### T020: Export OpenAPI Spec to File

| Property | Value |
|----------|-------|
| **ID** | T020 |
| **Priority** | P3 (Low) |
| **Complexity** | Low |
| **Depends On** | T019 |
| **Estimated Effort** | 0.25 session |

**Description**

Create a script to export the generated OpenAPI specification to a YAML file.

**Acceptance Criteria**

- [ ] Script generates `openapi.yaml` from running app
- [ ] YAML format matches spec in specification
- [ ] Can be run as: `python scripts/export_openapi.py`

**Files to Create**

| File | Purpose |
|------|---------|
| `scripts/export_openapi.py` | Export script |
| `openapi.yaml` | Generated spec |

---

#### T021: Verify Swagger UI Functionality

| Property | Value |
|----------|-------|
| **ID** | T021 |
| **Priority** | P3 (Low) |
| **Complexity** | Low |
| **Depends On** | T019 |
| **Estimated Effort** | 0.25 session |

**Description**

Verify that Swagger UI at `/docs` works correctly with all endpoints testable.

**Acceptance Criteria**

- [ ] `/docs` loads Swagger UI
- [ ] All endpoints visible and documented
- [ ] "Try it out" works for all endpoints
- [ ] Request/response examples shown
- [ ] `/redoc` also works as alternative

---

### Category: Testing (Phase 5)

---

#### T022: Set Up Pytest with Fixtures

| Property | Value |
|----------|-------|
| **ID** | T022 |
| **Priority** | P1 (High) |
| **Complexity** | Low |
| **Depends On** | T006 |
| **Estimated Effort** | 0.5 session |

**Description**

Set up pytest with shared fixtures for testing. Include test client, data store reset, and sample data fixtures.

**Acceptance Criteria**

- [ ] `pytest.ini` or `pyproject.toml` configured
- [ ] `conftest.py` with shared fixtures
- [ ] Test client fixture using httpx
- [ ] Data store reset between tests
- [ ] Sample project fixture
- [ ] `pytest` command runs without errors

**Files to Create**

| File | Purpose |
|------|---------|
| `tests/__init__.py` | Package marker |
| `tests/conftest.py` | Shared fixtures |
| `pytest.ini` | Pytest configuration |

**Implementation Hints**

```python
import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.data.store import MockDataStore

@pytest.fixture
def client():
    MockDataStore.reset()
    return TestClient(app)

@pytest.fixture
def seeded_client(client):
    from src.data.seed import seed_data
    seed_data()
    return client
```

---

#### T023: Write Model Unit Tests

| Property | Value |
|----------|-------|
| **ID** | T023 |
| **Priority** | P2 (Medium) |
| **Complexity** | Medium |
| **Depends On** | T002, T022 |
| **Estimated Effort** | 1 session |

**Description**

Write unit tests for Pydantic model validation rules.

**Acceptance Criteria**

- [ ] Test ProjectCreate with valid data
- [ ] Test ProjectCreate with missing required fields
- [ ] Test name length validation (1-100)
- [ ] Test description length validation (0-1000)
- [ ] Test status enum validation
- [ ] Test default values (status, description)
- [ ] Test ProjectUpdate validation

**Files to Create**

| File | Purpose |
|------|---------|
| `tests/unit/__init__.py` | Package marker |
| `tests/unit/test_models.py` | Model validation tests |

---

#### T024: Write Data Store Unit Tests

| Property | Value |
|----------|-------|
| **ID** | T024 |
| **Priority** | P2 (Medium) |
| **Complexity** | Medium |
| **Depends On** | T004, T022 |
| **Estimated Effort** | 1 session |

**Description**

Write unit tests for MockDataStore CRUD operations.

**Acceptance Criteria**

- [ ] Test create adds project with ID
- [ ] Test get_by_id returns correct project
- [ ] Test get_by_id returns None for missing
- [ ] Test get_all with pagination
- [ ] Test get_all with status filter
- [ ] Test update modifies project
- [ ] Test update returns None for missing
- [ ] Test delete removes project
- [ ] Test count with and without filter

**Files to Create**

| File | Purpose |
|------|---------|
| `tests/unit/test_store.py` | Data store tests |

---

#### T025: Write CRUD Integration Tests

| Property | Value |
|----------|-------|
| **ID** | T025 |
| **Priority** | P1 (High) |
| **Complexity** | High |
| **Depends On** | T007-T011, T022 |
| **Estimated Effort** | 1.5 sessions |

**Description**

Write integration tests for all CRUD endpoint happy paths.

**Acceptance Criteria**

- [ ] Test GET /projects returns list
- [ ] Test GET /projects/{id} returns project
- [ ] Test POST /projects creates project with 201
- [ ] Test PUT /projects/{id} updates project
- [ ] Test DELETE /projects/{id} returns 204
- [ ] Test response format matches spec
- [ ] Test timestamps are set correctly

**Files to Create**

| File | Purpose |
|------|---------|
| `tests/integration/__init__.py` | Package marker |
| `tests/integration/test_projects_crud.py` | CRUD tests |

---

#### T026: Write Error Handling Tests

| Property | Value |
|----------|-------|
| **ID** | T026 |
| **Priority** | P2 (Medium) |
| **Complexity** | Medium |
| **Depends On** | T014, T022 |
| **Estimated Effort** | 1 session |

**Description**

Write integration tests for all error scenarios.

**Acceptance Criteria**

- [ ] Test 404 for GET non-existent project
- [ ] Test 404 for PUT non-existent project
- [ ] Test 404 for DELETE non-existent project
- [ ] Test 422 for missing required fields
- [ ] Test 422 for invalid field values
- [ ] Test 400 for malformed JSON
- [ ] Test error response format matches spec

**Files to Create**

| File | Purpose |
|------|---------|
| `tests/integration/test_error_handling.py` | Error tests |

---

#### T027: Write Pagination/Filter Tests

| Property | Value |
|----------|-------|
| **ID** | T027 |
| **Priority** | P2 (Medium) |
| **Complexity** | Medium |
| **Depends On** | T007, T012, T022 |
| **Estimated Effort** | 1 session |

**Description**

Write integration tests for pagination and filtering.

**Acceptance Criteria**

- [ ] Test default pagination (limit=10, offset=0)
- [ ] Test custom limit and offset
- [ ] Test limit capped at 100
- [ ] Test offset beyond total returns empty
- [ ] Test status=active filter
- [ ] Test status=archived filter
- [ ] Test meta.total reflects filter
- [ ] Test pagination + filter combined

**Files to Create**

| File | Purpose |
|------|---------|
| `tests/integration/test_projects_filter.py` | Filter/pagination tests |

---

#### T028: Write Edge Case Tests

| Property | Value |
|----------|-------|
| **ID** | T028 |
| **Priority** | P2 (Medium) |
| **Complexity** | Medium |
| **Depends On** | T025-T027 |
| **Estimated Effort** | 0.5 session |

**Description**

Write tests for edge cases identified in the specification.

**Acceptance Criteria**

- [ ] Test empty project list
- [ ] Test name at exactly 100 chars
- [ ] Test description at exactly 1000 chars
- [ ] Test invalid UUID format
- [ ] Test empty request body
- [ ] Test extra fields in request (ignored)

**Files to Create**

| File | Purpose |
|------|---------|
| `tests/integration/test_edge_cases.py` | Edge case tests |

---

#### T029: Verify 90%+ Test Coverage

| Property | Value |
|----------|-------|
| **ID** | T029 |
| **Priority** | P1 (High) |
| **Complexity** | Low |
| **Depends On** | T023-T028 |
| **Estimated Effort** | 0.5 session |

**Description**

Run coverage report and ensure 90%+ coverage. Add any missing tests.

**Acceptance Criteria**

- [ ] `pytest --cov=src --cov-report=html` runs
- [ ] Coverage >= 90% for `src/` directory
- [ ] All endpoints have at least one test
- [ ] Coverage report generated as HTML

**Testing Notes**

```bash
pytest --cov=src --cov-report=html --cov-report=term-missing
open htmlcov/index.html
```

---

### Category: Docker (Phase 6)

---

#### T030: Create Dockerfile

| Property | Value |
|----------|-------|
| **ID** | T030 |
| **Priority** | P2 (Medium) |
| **Complexity** | Low |
| **Depends On** | T006 |
| **Estimated Effort** | 0.5 session |

**Description**

Create a production-ready Dockerfile using Python slim base image.

**Acceptance Criteria**

- [ ] Uses `python:3.11-slim` base image
- [ ] Multi-stage build (optional but nice)
- [ ] Non-root user for security
- [ ] Exposes port 8000
- [ ] Health check instruction included
- [ ] Minimal image size

**Files to Create**

| File | Purpose |
|------|---------|
| `Dockerfile` | Container build file |

**Implementation Hints**

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ src/
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

#### T031: Create docker-compose.yml

| Property | Value |
|----------|-------|
| **ID** | T031 |
| **Priority** | P3 (Low) |
| **Complexity** | Low |
| **Depends On** | T030 |
| **Estimated Effort** | 0.25 session |

**Description**

Create docker-compose for easy local development.

**Acceptance Criteria**

- [ ] Single service for the API
- [ ] Port mapping 8000:8000
- [ ] Volume mount for development (optional)
- [ ] `docker-compose up` starts the app

**Files to Create**

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Compose configuration |

---

#### T032: Create .dockerignore

| Property | Value |
|----------|-------|
| **ID** | T032 |
| **Priority** | P3 (Low) |
| **Complexity** | Low |
| **Depends On** | T030 |
| **Estimated Effort** | 0.1 session |

**Description**

Create .dockerignore to exclude unnecessary files from build context.

**Acceptance Criteria**

- [ ] Excludes `.git/`
- [ ] Excludes `__pycache__/`
- [ ] Excludes `venv/`
- [ ] Excludes `tests/`
- [ ] Excludes `*.pyc`
- [ ] Excludes `.env`

**Files to Create**

| File | Purpose |
|------|---------|
| `.dockerignore` | Build exclusions |

---

#### T033: Test Container Build and Run

| Property | Value |
|----------|-------|
| **ID** | T033 |
| **Priority** | P2 (Medium) |
| **Complexity** | Low |
| **Depends On** | T030-T032 |
| **Estimated Effort** | 0.25 session |

**Description**

Verify Docker container builds and runs correctly.

**Acceptance Criteria**

- [ ] `docker build -t projects-api .` succeeds
- [ ] `docker run -p 8000:8000 projects-api` starts
- [ ] `/health` endpoint accessible
- [ ] `/api/v1/projects` returns seeded data
- [ ] Container logs show startup info

**Testing Notes**

```bash
docker build -t projects-api .
docker run -d -p 8000:8000 --name projects-api-test projects-api
curl http://localhost:8000/health
docker logs projects-api-test
docker stop projects-api-test && docker rm projects-api-test
```

---

#### T034: Document Docker Usage in README

| Property | Value |
|----------|-------|
| **ID** | T034 |
| **Priority** | P2 (Medium) |
| **Complexity** | Low |
| **Depends On** | T033 |
| **Estimated Effort** | 0.25 session |

**Description**

Update README with Docker build and run instructions.

**Acceptance Criteria**

- [ ] Docker build command documented
- [ ] Docker run command documented
- [ ] docker-compose usage documented
- [ ] Environment variables documented
- [ ] Port configuration explained

**Files to Modify**

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modify | Add Docker section |

---

## Dependency Graph

```
T001 ─────────────────────────────────────────────────────────────┐
  │                                                               │
  ├── T002 ─── T003                                               │
  │     │                                                         │
  │     └── T004 ─── T005                                         │
  │           │                                                   │
  └── T006 ───┼─────────────────────────────────────────────────┐ │
              │                                                 │ │
              ├── T007 ─── T012                                 │ │
              │                                                 │ │
              ├── T008                                          │ │
              │                                                 │ │
              ├── T009                                          │ │
              │                                                 │ │
              ├── T010                                          │ │
              │                                                 │ │
              ├── T011                                          │ │
              │                                                 │ │
              ├── T013 ─── T014 ─── T015                        │ │
              │             │                                   │ │
              │             ├── T016                            │ │
              │             │                                   │ │
              │             └── T017                            │ │
              │                                                 │ │
              ├── T018                                          │ │
              │                                                 │ │
              ├── T019 ─── T020                                 │ │
              │     │                                           │ │
              │     └── T021                                    │ │
              │                                                 │ │
              └── T022 ───┬── T023                              │ │
                          ├── T024                              │ │
                          ├── T025                              │ │
                          ├── T026                              │ │
                          ├── T027                              │ │
                          ├── T028                              │ │
                          └── T029                              │ │
                                                                │ │
              T030 ─── T031                                     │ │
                │                                               │ │
                ├── T032                                        │ │
                │                                               │ │
                └── T033 ─── T034                               │ │
```

---

## Suggested Execution Order

### Session 1: Foundation
1. **T001** - Initialize Python project
2. **T002** - Create Project Pydantic models
3. **T003** - Create response wrapper models
4. **T004** - Implement MockDataStore
5. **T005** - Create seed data generator

### Session 2: Core API (Part 1)
6. **T006** - Create FastAPI app with CORS
7. **T007** - Implement GET /projects (list)
8. **T008** - Implement GET /projects/{id}
9. **T009** - Implement POST /projects

### Session 3: Core API (Part 2)
10. **T010** - Implement PUT /projects/{id}
11. **T011** - Implement DELETE /projects/{id}
12. **T012** - Add status filter

### Session 4: Error Handling
13. **T013** - Create custom exceptions
14. **T014** - Implement error handler
15. **T015** - Format validation errors
16. **T016** - Handle 404 consistently
17. **T017** - Validation edge cases

### Session 5: Health, Docs, Docker
18. **T018** - Implement /health
19. **T019** - Configure OpenAPI metadata
20. **T020** - Export OpenAPI spec
21. **T021** - Verify Swagger UI
22. **T030** - Create Dockerfile
23. **T031** - Create docker-compose
24. **T032** - Create .dockerignore
25. **T033** - Test container
26. **T034** - Document Docker usage

### Session 6: Testing (Part 1)
27. **T022** - Set up pytest
28. **T023** - Model unit tests
29. **T024** - Data store unit tests
30. **T025** - CRUD integration tests

### Session 7: Testing (Part 2)
31. **T026** - Error handling tests
32. **T027** - Pagination/filter tests
33. **T028** - Edge case tests
34. **T029** - Verify 90%+ coverage

---

*Task list generated: 2024-12-04*  
*Next: Run `/harness.generate` to convert to `memory/feature_list.json`*
