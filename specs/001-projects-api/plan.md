# Implementation Plan

**Feature Branch**: `001-projects-api`  
**Specification**: [spec.md](spec.md)  
**Created**: 2024-12-04  
**Estimated Sessions**: 6-8

---

## Executive Summary

Build a complete REST API for managing Projects using **FastAPI** (Python) with an in-memory mock data store. The implementation includes full CRUD operations, input validation, OpenAPI documentation, comprehensive testing (90%+ coverage), and Docker deployment.

---

## Tech Stack Decision

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Framework** | FastAPI | Built-in validation (Pydantic), auto OpenAPI docs, async support |
| **Language** | Python 3.11+ | Modern features, excellent ecosystem |
| **Validation** | Pydantic v2 | Native FastAPI integration, fast validation |
| **Testing** | pytest + httpx | Standard Python testing, async client support |
| **Container** | Docker | Portable, reproducible deployment |
| **UUID** | uuid (stdlib) | No external dependency needed |

### Why FastAPI?

1. **Automatic OpenAPI docs** - Swagger UI at `/docs`, ReDoc at `/redoc`
2. **Pydantic validation** - Request/response validation with clear error messages
3. **Type hints** - Better IDE support, self-documenting code
4. **Async ready** - Though we use sync for simplicity, scales easily
5. **Minimal boilerplate** - Focus on business logic

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         FastAPI App                            │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Middleware                                              │ │
│  │  - CORS (allow all origins for demo)                     │ │
│  │  - Request ID injection                                  │ │
│  │  - Error handling middleware                             │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Routers                                                 │ │
│  │  /api/v1/projects     → ProjectRouter                    │ │
│  │  /health              → HealthRouter                     │ │
│  │  /docs                → Swagger UI (auto)                │ │
│  └──────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Services                                                │ │
│  │  ProjectService                                          │ │
│  │  - list_projects(status, limit, offset)                  │ │
│  │  - get_project(id)                                       │ │
│  │  - create_project(data)                                  │ │
│  │  - update_project(id, data)                              │ │
│  │  - delete_project(id)                                    │ │
│  └──────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Data Layer                                              │ │
│  │  MockDataStore (Singleton)                               │ │
│  │  - _projects: Dict[str, Project]                         │ │
│  │  - CRUD operations                                       │ │
│  │  - Seeded on startup (50+ projects)                      │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── __init__.py
├── main.py                 # FastAPI app entry point
├── config.py               # Configuration settings
├── api/
│   ├── __init__.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── projects.py     # Project endpoints
│   │   └── health.py       # Health check endpoint
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── error_handler.py
│   └── dependencies.py     # Shared dependencies
├── models/
│   ├── __init__.py
│   ├── project.py          # Project Pydantic models
│   └── responses.py        # Response wrapper models
├── services/
│   ├── __init__.py
│   └── project_service.py  # Business logic
└── data/
    ├── __init__.py
    ├── store.py            # In-memory data store
    └── seed.py             # Seed data generator

tests/
├── __init__.py
├── conftest.py             # Shared fixtures
├── unit/
│   ├── __init__.py
│   ├── test_models.py      # Model validation tests
│   ├── test_store.py       # Data store tests
│   └── test_seed.py        # Seed data tests
└── integration/
    ├── __init__.py
    ├── test_projects_crud.py    # CRUD operation tests
    ├── test_projects_filter.py  # Filtering/pagination tests
    └── test_error_handling.py   # Error response tests

Dockerfile
docker-compose.yml
requirements.txt
pyproject.toml
README.md
openapi.yaml                # Generated/exported OpenAPI spec
```

---

## Implementation Phases

### Phase 1: Foundation
**Goal**: Set up project structure, models, and data store  
**Duration**: 1-2 sessions  
**Depends On**: None

#### Tasks

| ID | Task | Complexity | Depends On |
|----|------|------------|------------|
| T001 | Initialize Python project with dependencies | Low | - |
| T002 | Create Pydantic models for Project | Medium | T001 |
| T003 | Create response wrapper models | Low | T002 |
| T004 | Implement MockDataStore class | Medium | T002 |
| T005 | Create seed data generator (50+ projects) | Medium | T004 |

#### Deliverables
- `pyproject.toml` / `requirements.txt` with dependencies
- Complete Pydantic models with validation
- Working in-memory data store
- Seed data with realistic distribution

---

### Phase 2: Core API
**Goal**: Implement all CRUD endpoints  
**Duration**: 2-3 sessions  
**Depends On**: Phase 1

#### Tasks

| ID | Task | Complexity | Depends On |
|----|------|------------|------------|
| T006 | Create FastAPI app with CORS middleware | Low | T001 |
| T007 | Implement GET /projects (list with pagination) | Medium | T004, T006 |
| T008 | Implement GET /projects/{id} | Low | T004, T006 |
| T009 | Implement POST /projects | Medium | T004, T006 |
| T010 | Implement PUT /projects/{id} | Medium | T004, T006 |
| T011 | Implement DELETE /projects/{id} | Low | T004, T006 |
| T012 | Add status filter to GET /projects | Low | T007 |

#### Deliverables
- All 5 CRUD endpoints functional
- Pagination working with limit/offset
- Status filtering working
- Responses in standard format

---

### Phase 3: Error Handling & Validation
**Goal**: Comprehensive error handling and input validation  
**Duration**: 1 session  
**Depends On**: Phase 2

#### Tasks

| ID | Task | Complexity | Depends On |
|----|------|------------|------------|
| T013 | Create custom exception classes | Low | T006 |
| T014 | Implement global error handler middleware | Medium | T013 |
| T015 | Add validation error formatting (422 responses) | Medium | T014 |
| T016 | Handle 404 Not Found consistently | Low | T014 |
| T017 | Add request validation edge cases | Medium | T015 |

#### Deliverables
- Standard error response format across all endpoints
- Field-level validation errors
- Proper HTTP status codes
- Edge cases handled (empty body, invalid JSON, etc.)

---

### Phase 4: Health & Documentation
**Goal**: Health endpoint and OpenAPI documentation  
**Duration**: 0.5 sessions  
**Depends On**: Phase 2

#### Tasks

| ID | Task | Complexity | Depends On |
|----|------|------------|------------|
| T018 | Implement /health endpoint | Low | T006 |
| T019 | Configure OpenAPI metadata | Low | T006 |
| T020 | Export OpenAPI spec to openapi.yaml | Low | T019 |
| T021 | Verify Swagger UI functionality | Low | T019 |

#### Deliverables
- `/health` returning status and version
- Complete OpenAPI spec at `/docs`
- Exported `openapi.yaml` file
- All endpoints documented with examples

---

### Phase 5: Testing
**Goal**: Achieve 90%+ test coverage  
**Duration**: 2 sessions  
**Depends On**: Phases 1-4

#### Tasks

| ID | Task | Complexity | Depends On |
|----|------|------------|------------|
| T022 | Set up pytest with fixtures | Low | T006 |
| T023 | Write unit tests for Pydantic models | Medium | T002, T022 |
| T024 | Write unit tests for data store | Medium | T004, T022 |
| T025 | Write integration tests for CRUD operations | High | T007-T011, T022 |
| T026 | Write integration tests for error handling | Medium | T014, T022 |
| T027 | Write integration tests for pagination/filtering | Medium | T007, T012, T022 |
| T028 | Add edge case tests | Medium | T025-T027 |
| T029 | Verify 90%+ coverage with pytest-cov | Low | T023-T028 |

#### Deliverables
- Complete test suite
- All endpoints tested (happy path + errors)
- Edge cases covered
- 90%+ code coverage verified

---

### Phase 6: Docker & Deployment
**Goal**: Containerize application  
**Duration**: 0.5 sessions  
**Depends On**: Phases 1-4

#### Tasks

| ID | Task | Complexity | Depends On |
|----|------|------------|------------|
| T030 | Create Dockerfile | Low | T006 |
| T031 | Create docker-compose.yml | Low | T030 |
| T032 | Create .dockerignore | Low | T030 |
| T033 | Test container build and run | Low | T030-T032 |
| T034 | Document Docker usage in README | Low | T033 |

#### Deliverables
- Working Dockerfile
- docker-compose for easy startup
- Container runs and serves API
- README with Docker instructions

---

## Dependency Graph

```
Phase 1: Foundation
  T001 (project init)
    ├── T002 (models) ──┬── T003 (response models)
    │                   │
    │                   └── T004 (data store) ── T005 (seed data)
    │
Phase 2: Core API       │
    └── T006 (FastAPI) ─┼─┬── T007 (GET list) ── T012 (filter)
                        │ ├── T008 (GET one)
                        │ ├── T009 (POST)
                        │ ├── T010 (PUT)
                        │ └── T011 (DELETE)
                        │
Phase 3: Errors         │
    T013 (exceptions) ──┼── T014 (error handler)
                        │     ├── T015 (422 format)
                        │     ├── T016 (404 handling)
                        │     └── T017 (edge cases)
                        │
Phase 4: Docs           │
    T018 (health) ──────┤
    T019 (OpenAPI) ─────┼── T020 (export)
                        │── T021 (verify)
                        │
Phase 5: Testing        │
    T022 (pytest) ──────┼── T023 (model tests)
                        ├── T024 (store tests)
                        ├── T025 (CRUD tests)
                        ├── T026 (error tests)
                        ├── T027 (filter tests)
                        ├── T028 (edge tests)
                        └── T029 (coverage)

Phase 6: Docker
    T030 (Dockerfile) ──┬── T031 (compose)
                        ├── T032 (ignore)
                        ├── T033 (test)
                        └── T034 (docs)
```

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Pydantic v2 breaking changes | Low | Medium | Pin version in requirements, test early |
| Test coverage < 90% | Medium | Medium | Write tests alongside features, not after |
| Complex query param validation | Low | Low | Use FastAPI Query() with validation |
| Docker build issues | Low | Low | Use official Python slim image |
| Seed data performance | Low | Low | Generate once at startup, store in memory |
| Date/timezone issues | Medium | Low | Use UTC everywhere, ISO 8601 format |

---

## Technical Decisions

### 1. In-Memory Store Implementation

```python
# Singleton pattern for data store
class MockDataStore:
    _instance = None
    _projects: Dict[str, Project] = {}
    
    @classmethod
    def get_instance(cls) -> "MockDataStore":
        if cls._instance is None:
            cls._instance = cls()
            cls._instance._seed_data()
        return cls._instance
```

### 2. Response Formatting

All responses wrapped in standard format:
```python
class SuccessResponse(BaseModel, Generic[T]):
    data: T
    meta: ResponseMeta

class ErrorResponse(BaseModel):
    error: ErrorDetail
```

### 3. Validation Strategy

- **Path params**: UUID validation via Pydantic
- **Query params**: FastAPI Query() with constraints
- **Body**: Pydantic models with Field() validators
- **Custom errors**: Override RequestValidationError handler

### 4. CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Demo/reference only
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Success Criteria

### Functionality
- [ ] All 5 CRUD endpoints working
- [ ] Pagination returns correct counts
- [ ] Status filter returns correct subset
- [ ] Error responses follow standard format
- [ ] Health endpoint returns 200

### Quality
- [ ] 90%+ test coverage achieved
- [ ] All tests passing
- [ ] No linting errors (ruff/black)
- [ ] Type hints throughout

### Documentation
- [ ] OpenAPI spec complete at /docs
- [ ] README with setup instructions
- [ ] Docker usage documented
- [ ] All endpoints have examples

### Deployment
- [ ] Docker build succeeds
- [ ] Container starts and serves API
- [ ] Health check accessible

---

## Open Decisions (Resolved)

| Decision | Options | Resolution |
|----------|---------|------------|
| Framework | FastAPI vs Flask vs Django | **FastAPI** - best docs/validation combo |
| Python version | 3.10 vs 3.11 vs 3.12 | **3.11** - stable, good performance |
| Test runner | pytest vs unittest | **pytest** - better fixtures, output |
| Docker base | alpine vs slim vs full | **slim** - good balance size/compatibility |
| Seed data count | 25 vs 50 vs 100 | **52** - exceeds requirement, divisible |

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Server bind address |
| `PORT` | `8000` | Server port |
| `LOG_LEVEL` | `INFO` | Logging verbosity |
| `SEED_COUNT` | `52` | Number of seeded projects |

### Requirements (requirements.txt)

```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
pydantic>=2.5.0
python-multipart>=0.0.6

# Testing
pytest>=8.0.0
pytest-cov>=4.1.0
httpx>=0.26.0

# Development
ruff>=0.2.0
black>=24.1.0
```

---

## Session Breakdown

| Session | Tasks | Goal |
|---------|-------|------|
| 1 | T001-T005 | Foundation complete |
| 2 | T006-T009 | Basic CRUD working |
| 3 | T010-T012 | Full CRUD + filtering |
| 4 | T013-T017 | Error handling complete |
| 5 | T018-T021, T030-T034 | Health, docs, Docker |
| 6 | T022-T025 | Core tests |
| 7 | T026-T029 | Complete test coverage |

**Total Estimated Sessions**: 6-7

---

*Plan created: 2024-12-04*  
*Next: Run `/speckit.tasks` to generate detailed task list*
