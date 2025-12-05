# REST API with Mock Data - Project Constitution

> **Project**: Weather API Reference Implementation  
> **Type**: REST API with In-Memory Mock Data Store  
> **Created**: 2024-12-04  
> **Status**: Active

This document defines the core principles, standards, and quality gates for the REST API with Mock Data reference example.

---

## Vision

Create a **clean, well-documented REST API reference implementation** that serves as a learning resource and template for building RESTful services. The API uses in-memory mock data to demonstrate best practices without external dependencies.

**Goals:**
- Demonstrate clean RESTful API design patterns
- Provide a testable, self-contained reference implementation
- Show proper error handling, validation, and documentation
- Serve as a starting point for real-world API development

**Non-Goals (Explicitly Out of Scope):**
- ❌ Authentication/Authorization
- ❌ Database persistence (data resets on restart)
- ❌ Rate limiting
- ❌ External service integrations
- ❌ Production deployment considerations

---

## Core Principles

### 1. Clean RESTful Design
- Follow REST architectural constraints
- Use standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Return appropriate HTTP status codes (200, 201, 204, 400, 404, 422, 500)
- JSON request/response bodies with consistent structure
- Resource-oriented URLs (`/resources/{id}`)

### 2. Framework-Agnostic Specification
- Specifications describe **what**, not **how**
- Implementation can use FastAPI, Express, Spring Boot, etc.
- API contract defined via OpenAPI/Swagger
- Tests verify behavior, not implementation details

### 3. Test-Driven Development (TDD)
- Write the test FIRST (Red)
- Implement the feature (Green)
- Refactor and verify (Refactor)
- Target: **90%+ endpoint test coverage**

### 4. Incremental Progress
- One feature at a time
- Complete and verify before moving on
- Commit after each success
- Don't try to do too much in one session

### 5. Self-Documenting API
- OpenAPI/Swagger documentation auto-generated
- Every endpoint documented with examples
- Error responses clearly defined
- Interactive API explorer available

### 6. Consistent Error Handling
- Standard error response format across all endpoints
- Meaningful error messages for debugging
- Proper HTTP status code usage
- Validation errors include field-level details

---

## Technical Standards

### API Design Standards

| Aspect | Standard |
|--------|----------|
| **Protocol** | HTTP/HTTPS |
| **Format** | JSON (application/json) |
| **Naming** | snake_case for JSON fields |
| **URLs** | lowercase, hyphens for multi-word resources |
| **Versioning** | URL path prefix (e.g., `/api/v1/`) |
| **Pagination** | Cursor-based or offset-based with `limit` param |

### HTTP Status Codes

| Code | Usage |
|------|-------|
| `200 OK` | Successful GET, PUT, PATCH |
| `201 Created` | Successful POST creating resource |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Malformed request syntax |
| `404 Not Found` | Resource doesn't exist |
| `422 Unprocessable Entity` | Validation errors |
| `500 Internal Server Error` | Unexpected server errors |

### Standard Response Formats

**Success Response:**
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-12-04T10:30:00Z"
  }
}
```

**Collection Response:**
```json
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "limit": 10,
    "offset": 0
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

---

## Libraries

### Framework Choice
The implementer chooses their preferred framework. Common options:

| Language | Framework Options |
|----------|-------------------|
| Python | FastAPI (recommended), Flask, Django REST |
| TypeScript | Express, Fastify, Hono, NestJS |
| Java | Spring Boot, Quarkus, Micronaut |
| Go | Gin, Echo, Chi |
| Rust | Axum, Actix-web |

### Required Capabilities (Any Framework)

| Capability | Requirement |
|------------|-------------|
| Validation | Built-in or library-based request validation |
| OpenAPI | Auto-generated or manual OpenAPI 3.0+ spec |
| Testing | Unit + Integration test framework |
| JSON | Native JSON serialization/deserialization |

### Default Libraries (If Using Framework Defaults)

See `.github/instructions/libraries.instructions.md` for complete defaults by language.

| Category | Python Default | TypeScript Default |
|----------|----------------|-------------------|
| Framework | FastAPI | Express |
| Validation | Pydantic | Zod |
| Testing | pytest | Playwright + Vitest |
| HTTP Client (tests) | httpx | fetch (native) |

---

## Quality Gates

### Phase 1: Specification Quality Gate

A specification is **ready** when:

- [ ] All CRUD operations defined (Create, Read, Update, Delete)
- [ ] Request/response schemas documented
- [ ] HTTP status codes specified for all scenarios
- [ ] Error cases enumerated
- [ ] Validation rules defined
- [ ] At least 3 example requests/responses provided
- [ ] Non-goals explicitly stated
- [ ] Reviewed for REST best practices

### Phase 2: Plan Quality Gate

A plan is **ready** when:

- [ ] All specification requirements mapped to tasks
- [ ] Task dependencies identified
- [ ] Complexity estimates provided (Low/Med/High)
- [ ] Session estimates realistic
- [ ] Testing strategy defined
- [ ] Risk assessment completed
- [ ] Phases logically ordered (foundation → features → polish)

### Phase 3: Tasks Quality Gate

Tasks are **ready** when:

- [ ] Each task has clear acceptance criteria
- [ ] Files to create/modify listed
- [ ] Testing approach documented
- [ ] Single responsibility (one concern per task)
- [ ] Dependencies explicit
- [ ] Estimated at ≤1 session per task
- [ ] Implementation hints provided where helpful

### Phase 4: Implementation Quality Gate

Implementation is **complete** when:

- [ ] All CRUD endpoints functional
- [ ] OpenAPI/Swagger docs generated and accessible
- [ ] Input validation working with clear error messages
- [ ] **90%+ endpoint test coverage** (unit + integration)
- [ ] All tests passing
- [ ] No linting errors
- [ ] Code follows framework idioms
- [ ] README with setup and usage instructions

---

## Testing Strategy

### Test Pyramid

```
         /\
        /  \     E2E Tests (API contract tests)
       /----\    
      /      \   Integration Tests (endpoint + mock data)
     /--------\  
    /          \ Unit Tests (validation, data layer)
   /______________\
```

### Coverage Requirements

| Level | Target | Focus |
|-------|--------|-------|
| Unit | 80%+ | Validation logic, data transformations |
| Integration | 90%+ | All endpoints with various inputs |
| E2E | Key flows | Happy path for all CRUD operations |

### What to Test

| Test Type | Examples |
|-----------|----------|
| Happy Path | GET returns data, POST creates resource |
| Validation | Missing fields, invalid formats, type errors |
| Edge Cases | Empty collections, not found, duplicate keys |
| Error Handling | Malformed JSON, server errors |

### Test Structure

```
tests/
├── unit/
│   ├── test_validation.py
│   └── test_models.py
├── integration/
│   ├── test_weather_endpoints.py
│   └── test_error_handling.py
└── conftest.py (fixtures)
```

---

## File Conventions

### Project Structure

```
{project-root}/
├── src/                    # Source code
│   ├── api/               # Route handlers
│   ├── models/            # Data models/schemas
│   ├── services/          # Business logic
│   └── data/              # Mock data store
├── tests/                  # Test files
├── docs/                   # Additional documentation
├── openapi.yaml           # OpenAPI specification
├── README.md              # Setup and usage
└── memory/                # Agent harness files
    ├── constitution.md    # This file
    ├── feature_list.json  # Feature tracking
    └── claude-progress.md # Session notes
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (Python) | snake_case | `weather_controller.py` |
| Files (TS/JS) | camelCase or kebab-case | `weatherController.ts` |
| Classes | PascalCase | `WeatherService` |
| Functions | snake_case (Python) / camelCase (TS) | `get_forecast()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RESULTS` |
| API URLs | kebab-case | `/api/v1/weather-data` |
| JSON fields | snake_case | `"temperature_celsius"` |

---

## Documentation Requirements

### Required Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Setup, running, API overview |
| `openapi.yaml` | Complete API specification |
| Inline docstrings | Function/method documentation |
| `CONTRIBUTING.md` | How to contribute |

### API Documentation

Every endpoint must document:
- HTTP method and URL
- Request parameters (path, query, body)
- Request body schema with example
- Response schemas for all status codes
- Error response examples

---

## Agent Session Protocol

### Starting a Session
1. Read this constitution
2. Read `memory/claude-progress.md` for context
3. Read `memory/feature_list.json` for current state
4. Run `init.sh` to start the development environment
5. Verify existing tests pass

### During a Session
1. Pick ONE feature with `passes: false`
2. Write failing test (Red)
3. Implement to pass (Green)
4. Refactor and verify (Refactor)
5. Update `feature_list.json` when verified
6. Commit with descriptive message

### Ending a Session
1. All work committed and pushed
2. Update `memory/claude-progress.md` with:
   - What was completed
   - Issues discovered
   - Next steps
   - Current progress (X/Y features)
3. Leave environment in working state

---

## Feature List Rules

The `memory/feature_list.json` is sacred:
- ✅ Change `"passes": false` to `"passes": true` when verified
- ❌ NEVER remove features
- ❌ NEVER edit descriptions
- ❌ NEVER modify steps
- ❌ NEVER reorder features

---

## Coding Standards

When generating or modifying code:
- Follow existing project conventions
- Prefer clarity over cleverness
- Include appropriate error handling
- Write code that is easy to modify

### When Modifying Files
- Make minimal, focused changes
- Preserve existing formatting
- Document significant changes
- Test changes when possible

---

## Communication Standards

### With Users
- Be concise but thorough
- Explain "why" not just "what"
- Offer options when appropriate
- Acknowledge limitations

### Between Agents (Session Handoff)
- Provide complete handoff context
- Reference specific files and locations
- State clear success criteria
- Include rollback instructions

---

## Boundaries

### Agents Should
- Ask for clarification when uncertain
- Refuse clearly harmful requests
- Suggest alternatives when blocked
- Learn from feedback

### Agents Should Not
- Make assumptions about intent
- Execute without a plan
- Ignore project conventions
- Forget to checkpoint state

---

*This constitution was created on 2024-12-04. Amendments should be documented with dates and rationale.*
