"""Projects API - FastAPI Application Entry Point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.middleware import register_exception_handlers
from src.api.routes import api_router
from src.config import settings
from src.data.store import MockDataStore


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: ensure data store is seeded
    MockDataStore.get_instance()
    yield
    # Shutdown: nothing to clean up for in-memory store


app = FastAPI(
    title=settings.app_name,
    description="RESTful API for managing projects with mock data",
    version=settings.app_version,
    lifespan=lifespan,
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


@app.get("/")
def root():
    """Root endpoint - welcome message."""
    return {"message": "Welcome to Projects API", "docs": "/docs"}
