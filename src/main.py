"""Projects API - FastAPI Application Entry Point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.middleware import register_exception_handlers
from src.api.routes import api_router
from src.api.routes.health import router as health_router
from src.config import settings
from src.data.store import MockDataStore


# OpenAPI tags metadata
tags_metadata = [
    {
        "name": "Projects",
        "description": "Operations for managing projects (CRUD)",
    },
    {
        "name": "Health",
        "description": "Health check endpoints for monitoring",
    },
]

# OpenAPI servers
servers = [
    {
        "url": "http://localhost:8000",
        "description": "Local development server",
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: ensure data store is seeded
    MockDataStore.get_instance()
    yield
    # Shutdown: nothing to clean up for in-memory store


app = FastAPI(
    title=settings.app_name,
    description="RESTful API for managing projects with mock data. "
    "Provides CRUD operations on projects with pagination, filtering, and validation.",
    version=settings.app_version,
    lifespan=lifespan,
    openapi_tags=tags_metadata,
    servers=servers,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

# Register exception handlers
register_exception_handlers(app)

# Include API routes
app.include_router(api_router)

# Include health router (not under /api/v1)
app.include_router(health_router)


@app.get("/", tags=["Health"])
def root():
    """Root endpoint - welcome message."""
    return {"message": "Welcome to Projects API", "docs": "/docs"}
