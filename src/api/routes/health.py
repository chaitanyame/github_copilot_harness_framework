# src/api/routes/health.py
"""Health check endpoint."""

from datetime import datetime, timezone

from fastapi import APIRouter

from src.config import settings

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    summary="Health check",
    description="Check if the API is healthy and running.",
    operation_id="healthCheck",
)
def health_check() -> dict:
    """Return health status of the API."""
    return {
        "status": "healthy",
        "version": settings.app_version,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
