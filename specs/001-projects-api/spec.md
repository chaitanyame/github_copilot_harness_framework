# Projects API Specification

> **Created**: 2024-12-04  
> **Branch**: `001-projects-api`  
> **Status**: Draft

## Overview

A RESTful API for managing Projects with full CRUD operations, pagination, filtering, and comprehensive mock data. This serves as the reference implementation for demonstrating clean REST API design patterns.

---

## User Stories

### Project Manager
- As a **project manager**, I want to **list all projects with filtering** so that I can **find projects by status quickly**
- As a **project manager**, I want to **create new projects** so that I can **track work initiatives**
- As a **project manager**, I want to **update project details** so that I can **keep information current**
- As a **project manager**, I want to **archive completed projects** so that I can **declutter active views**

### Developer
- As a **developer**, I want to **retrieve project details by ID** so that I can **display project information**
- As a **developer**, I want to **paginate large result sets** so that I can **handle many projects efficiently**
- As a **developer**, I want to **receive clear error messages** so that I can **debug integration issues quickly**

### API Consumer
- As an **API consumer**, I want to **access OpenAPI documentation** so that I can **understand available endpoints**
- As an **API consumer**, I want to **receive consistent response formats** so that I can **parse responses reliably**

---

## Requirements

### Functional Requirements

#### FR-001: List Projects
- **Endpoint**: `GET /api/v1/projects`
- **Description**: Retrieve a paginated list of projects with optional filtering
- **Query Parameters**:
  - `status` (optional): Filter by status (`active`, `archived`, or omit for all)
  - `limit` (optional): Number of results per page (default: 10, max: 100)
  - `offset` (optional): Number of records to skip (default: 0)
- **Acceptance**: Returns array of projects matching criteria with pagination metadata

#### FR-002: Get Project by ID
- **Endpoint**: `GET /api/v1/projects/{id}`
- **Description**: Retrieve a single project by its unique identifier
- **Path Parameters**:
  - `id` (required): Project UUID
- **Acceptance**: Returns full project details or 404 if not found

#### FR-003: Create Project
- **Endpoint**: `POST /api/v1/projects`
- **Description**: Create a new project
- **Request Body**: Project data (name, description, status, owner)
- **Acceptance**: Returns created project with generated ID and timestamps

#### FR-004: Update Project
- **Endpoint**: `PUT /api/v1/projects/{id}`
- **Description**: Replace all fields of an existing project
- **Path Parameters**:
  - `id` (required): Project UUID
- **Request Body**: Complete project data
- **Acceptance**: Returns updated project with new `updatedAt` timestamp

#### FR-005: Delete Project
- **Endpoint**: `DELETE /api/v1/projects/{id}`
- **Description**: Remove a project from the system
- **Path Parameters**:
  - `id` (required): Project UUID
- **Acceptance**: Returns 204 No Content on success, 404 if not found

#### FR-006: Input Validation
- **Description**: All inputs must be validated before processing
- **Acceptance**: Returns 422 with field-level errors for invalid input

#### FR-007: Mock Data Store
- **Description**: In-memory data store with seeded projects
- **Acceptance**: 50+ projects with realistic data, multiple owners, varied statuses

### Non-Functional Requirements

#### NFR-001: Performance
- Response time < 100ms for all endpoints
- Support for at least 100 concurrent requests

#### NFR-002: Documentation
- OpenAPI 3.0+ specification available at `/api/docs`
- Interactive Swagger UI for testing

#### NFR-003: Consistency
- All responses follow standard JSON format from constitution
- All errors follow standard error response format

---

## Technical Design

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Routes: /api/v1/projects/*                         │   │
│  │  - Request validation                               │   │
│  │  - Response formatting                              │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                      Service Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ProjectService                                     │   │
│  │  - Business logic                                   │   │
│  │  - Data transformation                              │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                       Data Layer                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  MockDataStore                                      │   │
│  │  - In-memory Map/Dict                               │   │
│  │  - Seeded on startup                                │   │
│  │  - Reset on restart                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

#### Project Schema

```typescript
interface Project {
  id: string;           // UUID v4
  name: string;         // 1-100 characters, required
  description: string;  // 0-1000 characters, optional (empty string if not provided)
  status: ProjectStatus;// "active" | "archived"
  owner: string;        // Owner identifier (e.g., "user_001")
  created_at: string;   // ISO 8601 datetime
  updated_at: string;   // ISO 8601 datetime
}

type ProjectStatus = "active" | "archived";
```

#### Create/Update Request Schema

```typescript
interface ProjectCreateRequest {
  name: string;         // Required, 1-100 chars
  description?: string; // Optional, max 1000 chars
  status?: ProjectStatus; // Optional, defaults to "active"
  owner: string;        // Required
}

interface ProjectUpdateRequest {
  name: string;         // Required, 1-100 chars
  description?: string; // Optional, max 1000 chars
  status: ProjectStatus;// Required for PUT
  owner: string;        // Required
}
```

### API Response Formats

#### Success: Single Project
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Website Redesign",
    "description": "Complete overhaul of company website",
    "status": "active",
    "owner": "user_001",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-03-20T14:45:00Z"
  },
  "meta": {
    "timestamp": "2024-12-04T10:30:00Z"
  }
}
```

#### Success: Project List
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Website Redesign",
      "description": "Complete overhaul of company website",
      "status": "active",
      "owner": "user_001",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-03-20T14:45:00Z"
    }
  ],
  "meta": {
    "total": 52,
    "limit": 10,
    "offset": 0,
    "timestamp": "2024-12-04T10:30:00Z"
  }
}
```

#### Success: Delete (204 No Content)
No response body.

---

## Error Responses

### 400 Bad Request - Malformed Request

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Malformed request syntax",
    "details": []
  }
}
```

**Triggers:**
- Invalid JSON body
- Malformed query parameters

### 404 Not Found - Resource Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Project not found",
    "details": [
      {
        "field": "id",
        "message": "No project exists with ID: 550e8400-e29b-41d4-a716-446655440999"
      }
    ]
  }
}
```

**Triggers:**
- GET /projects/{id} with non-existent ID
- PUT /projects/{id} with non-existent ID
- DELETE /projects/{id} with non-existent ID

### 422 Unprocessable Entity - Validation Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      },
      {
        "field": "name",
        "message": "Name must be between 1 and 100 characters"
      },
      {
        "field": "status",
        "message": "Status must be one of: active, archived"
      },
      {
        "field": "owner",
        "message": "Owner is required"
      }
    ]
  }
}
```

**Triggers:**
- Missing required fields
- Field length violations
- Invalid enum values
- Invalid UUID format for path parameter

### 500 Internal Server Error

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "details": []
  }
}
```

**Triggers:**
- Unexpected server-side errors

---

## Mock Data Requirements

### Seeded Data Specifications

| Requirement | Specification |
|-------------|---------------|
| **Total Projects** | 50+ seeded projects |
| **Status Distribution** | ~35 active, ~15 archived |
| **Unique Owners** | 8-10 owners with realistic distribution |
| **Owner Distribution** | Some owners have 10+ projects, some have 1-2 |

### Sample Owner Distribution

| Owner ID | Name | Project Count |
|----------|------|---------------|
| user_001 | Alice Johnson | 12 |
| user_002 | Bob Smith | 8 |
| user_003 | Carol Williams | 7 |
| user_004 | David Brown | 6 |
| user_005 | Eve Davis | 5 |
| user_006 | Frank Miller | 5 |
| user_007 | Grace Wilson | 4 |
| user_008 | Henry Taylor | 3 |

### Project Name Examples

Projects should have realistic, varied names:
- "Website Redesign 2024"
- "Mobile App v2.0"
- "Customer Portal"
- "API Gateway Migration"
- "Data Analytics Dashboard"
- "Infrastructure Upgrade"
- "Security Audit Q1"
- "Documentation Overhaul"

### Date Distribution

- `created_at`: Spread across the past 12 months
- `updated_at`: Always >= `created_at`, more recent for active projects
- Archived projects: Typically have older `updated_at` dates

---

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Projects API
  description: RESTful API for managing projects with mock data
  version: 1.0.0
  contact:
    name: API Support
servers:
  - url: http://localhost:8000/api/v1
    description: Local development server

paths:
  /projects:
    get:
      summary: List all projects
      description: Retrieve a paginated list of projects with optional filtering
      operationId: listProjects
      tags:
        - Projects
      parameters:
        - name: status
          in: query
          description: Filter by project status
          required: false
          schema:
            type: string
            enum: [active, archived]
        - name: limit
          in: query
          description: Maximum number of projects to return
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 10
        - name: offset
          in: query
          description: Number of projects to skip
          required: false
          schema:
            type: integer
            minimum: 0
            default: 0
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectListResponse'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

    post:
      summary: Create a new project
      description: Create a new project with the provided data
      operationId: createProject
      tags:
        - Projects
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProjectCreateRequest'
      responses:
        '201':
          description: Project created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectResponse'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /projects/{id}:
    get:
      summary: Get a project by ID
      description: Retrieve a single project by its unique identifier
      operationId: getProject
      tags:
        - Projects
      parameters:
        - name: id
          in: path
          description: Project UUID
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectResponse'
        '404':
          description: Project not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

    put:
      summary: Update a project
      description: Replace all fields of an existing project
      operationId: updateProject
      tags:
        - Projects
      parameters:
        - name: id
          in: path
          description: Project UUID
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProjectUpdateRequest'
      responses:
        '200':
          description: Project updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectResponse'
        '404':
          description: Project not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

    delete:
      summary: Delete a project
      description: Remove a project from the system
      operationId: deleteProject
      tags:
        - Projects
      parameters:
        - name: id
          in: path
          description: Project UUID
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Project deleted successfully
        '404':
          description: Project not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    Project:
      type: object
      required:
        - id
        - name
        - description
        - status
        - owner
        - created_at
        - updated_at
      properties:
        id:
          type: string
          format: uuid
          description: Unique project identifier
          example: "550e8400-e29b-41d4-a716-446655440000"
        name:
          type: string
          minLength: 1
          maxLength: 100
          description: Project name
          example: "Website Redesign"
        description:
          type: string
          maxLength: 1000
          description: Project description
          example: "Complete overhaul of company website"
        status:
          type: string
          enum: [active, archived]
          description: Project status
          example: "active"
        owner:
          type: string
          description: Owner identifier
          example: "user_001"
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
          example: "2024-01-15T10:30:00Z"
        updated_at:
          type: string
          format: date-time
          description: Last update timestamp
          example: "2024-03-20T14:45:00Z"

    ProjectCreateRequest:
      type: object
      required:
        - name
        - owner
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
          description: Project name
          example: "New Project"
        description:
          type: string
          maxLength: 1000
          description: Project description
          example: "A new project description"
        status:
          type: string
          enum: [active, archived]
          default: active
          description: Project status
        owner:
          type: string
          description: Owner identifier
          example: "user_001"

    ProjectUpdateRequest:
      type: object
      required:
        - name
        - status
        - owner
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
          description: Project name
          example: "Updated Project Name"
        description:
          type: string
          maxLength: 1000
          description: Project description
          example: "Updated description"
        status:
          type: string
          enum: [active, archived]
          description: Project status
        owner:
          type: string
          description: Owner identifier
          example: "user_001"

    ProjectResponse:
      type: object
      required:
        - data
        - meta
      properties:
        data:
          $ref: '#/components/schemas/Project'
        meta:
          $ref: '#/components/schemas/ResponseMeta'

    ProjectListResponse:
      type: object
      required:
        - data
        - meta
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Project'
        meta:
          $ref: '#/components/schemas/PaginationMeta'

    ResponseMeta:
      type: object
      required:
        - timestamp
      properties:
        timestamp:
          type: string
          format: date-time
          example: "2024-12-04T10:30:00Z"

    PaginationMeta:
      type: object
      required:
        - total
        - limit
        - offset
        - timestamp
      properties:
        total:
          type: integer
          description: Total number of matching projects
          example: 52
        limit:
          type: integer
          description: Maximum results per page
          example: 10
        offset:
          type: integer
          description: Number of records skipped
          example: 0
        timestamp:
          type: string
          format: date-time
          example: "2024-12-04T10:30:00Z"

    ErrorResponse:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          required:
            - code
            - message
            - details
          properties:
            code:
              type: string
              enum: [BAD_REQUEST, NOT_FOUND, VALIDATION_ERROR, INTERNAL_ERROR]
              example: "VALIDATION_ERROR"
            message:
              type: string
              example: "Invalid input data"
            details:
              type: array
              items:
                $ref: '#/components/schemas/ErrorDetail'

    ErrorDetail:
      type: object
      required:
        - field
        - message
      properties:
        field:
          type: string
          description: Field that caused the error
          example: "name"
        message:
          type: string
          description: Error message for this field
          example: "Name is required"
```

---

## Acceptance Criteria

### Endpoint Functionality
- [ ] `GET /api/v1/projects` returns paginated list of projects
- [ ] `GET /api/v1/projects?status=active` filters by status correctly
- [ ] `GET /api/v1/projects?limit=5&offset=10` paginates correctly
- [ ] `GET /api/v1/projects/{id}` returns single project
- [ ] `GET /api/v1/projects/{id}` returns 404 for non-existent ID
- [ ] `POST /api/v1/projects` creates new project with generated ID
- [ ] `POST /api/v1/projects` sets `created_at` and `updated_at` automatically
- [ ] `PUT /api/v1/projects/{id}` updates existing project
- [ ] `PUT /api/v1/projects/{id}` updates `updated_at` timestamp
- [ ] `PUT /api/v1/projects/{id}` returns 404 for non-existent ID
- [ ] `DELETE /api/v1/projects/{id}` removes project
- [ ] `DELETE /api/v1/projects/{id}` returns 204 on success
- [ ] `DELETE /api/v1/projects/{id}` returns 404 for non-existent ID

### Validation
- [ ] Missing `name` returns 422 with field error
- [ ] Missing `owner` returns 422 with field error
- [ ] Name > 100 chars returns 422 with field error
- [ ] Description > 1000 chars returns 422 with field error
- [ ] Invalid `status` value returns 422 with field error
- [ ] Invalid UUID format returns 422 with field error
- [ ] Multiple validation errors returned in single response

### Response Format
- [ ] All success responses include `data` and `meta` objects
- [ ] All error responses include `error` object with `code`, `message`, `details`
- [ ] List responses include `total`, `limit`, `offset` in meta
- [ ] All timestamps in ISO 8601 format

### Mock Data
- [ ] 50+ projects seeded on startup
- [ ] Projects distributed across 8-10 owners
- [ ] Mix of active (~70%) and archived (~30%) projects
- [ ] Realistic project names and descriptions
- [ ] Varied date ranges for `created_at` and `updated_at`

### Documentation
- [ ] OpenAPI spec accessible at `/api/docs` or `/docs`
- [ ] All endpoints documented with examples
- [ ] All error responses documented

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty project list (all filtered out) | Return `{"data": [], "meta": {"total": 0, ...}}` |
| Invalid UUID format in path | Return 422 with validation error |
| UUID not in database | Return 404 Not Found |
| Negative offset | Return 400 or treat as 0 |
| Limit = 0 | Return 400 or use default (10) |
| Limit > 100 | Cap at 100 |
| Empty request body on POST | Return 422 with validation errors |
| Extra fields in request body | Ignore extra fields (permissive) |
| Duplicate project name | Allow (names not unique) |
| Very long but valid description | Accept up to 1000 chars |
| Status filter with invalid value | Return 400 or ignore filter |
| Offset beyond total count | Return empty data array |

---

## Testing Strategy

### Unit Tests
- Validation logic for all fields
- Data transformation functions
- Mock data generation
- Query parameter parsing

### Integration Tests
- All CRUD operations (happy path)
- All error scenarios (4xx responses)
- Pagination edge cases
- Filter combinations
- Response format validation

### Coverage Target
- **90%+ endpoint coverage**
- All HTTP status codes exercised
- All validation rules tested

---

## Open Questions

1. **Partial Updates (PATCH)**: Should we support PATCH for partial updates, or is PUT sufficient for this reference implementation?
   - *Recommendation*: Start with PUT only, add PATCH in future iteration

2. **Search/Filter**: Should we add text search on name/description?
   - *Recommendation*: Out of scope for v1, can add later

3. **Sorting**: Should we support `?sort=created_at:desc`?
   - *Recommendation*: Out of scope for v1, can add later

---

## Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| UUID library | External | Generate project IDs |
| Validation library | External | Input validation (Pydantic/Zod) |
| OpenAPI generator | External | Auto-generate API docs |
| Test framework | External | pytest/vitest for testing |

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/api/projects.py` | Route handlers |
| `src/models/project.py` | Data models/schemas |
| `src/services/project_service.py` | Business logic |
| `src/data/mock_store.py` | In-memory data store |
| `src/data/seed_data.py` | Project seed data generator |
| `tests/integration/test_projects.py` | Endpoint tests |
| `tests/unit/test_validation.py` | Validation tests |
| `openapi.yaml` | OpenAPI specification |

---

*Specification created: 2024-12-04*  
*Next: Run `/speckit.plan` to create implementation plan*
