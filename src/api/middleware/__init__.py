# src/api/middleware/__init__.py
"""API middleware package."""

from src.api.middleware.error_handler import register_exception_handlers

__all__ = ["register_exception_handlers"]
