# src/api/middleware/error_handler.py
"""Global exception handlers for consistent error responses."""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from src.api.exceptions import APIException


def register_exception_handlers(app: FastAPI) -> None:
    """Register global exception handlers on the FastAPI app.

    Args:
        app: FastAPI application instance
    """

    @app.exception_handler(APIException)
    async def api_exception_handler(
        request: Request, exc: APIException
    ) -> JSONResponse:
        """Handle custom APIException errors."""
        error_body: dict = {
            "code": exc.code,
            "message": exc.message,
        }
        if exc.details is not None:
            error_body["details"] = exc.details

        return JSONResponse(
            status_code=exc.status_code,
            content={"error": error_body},
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        """Handle Starlette/FastAPI HTTPException errors."""
        # Check if the detail is already in our expected format
        detail = exc.detail
        if isinstance(detail, dict) and "error" in detail and "message" in detail:
            # Legacy format from our endpoints
            error_body = {
                "code": detail.get("error", "UNKNOWN_ERROR").upper().replace("-", "_"),
                "message": detail.get("message", str(exc.detail)),
            }
        else:
            # Map status codes to error codes
            code_map = {
                400: "BAD_REQUEST",
                401: "UNAUTHORIZED",
                403: "FORBIDDEN",
                404: "NOT_FOUND",
                405: "METHOD_NOT_ALLOWED",
                409: "CONFLICT",
                422: "VALIDATION_ERROR",
                500: "INTERNAL_ERROR",
            }
            error_code = code_map.get(exc.status_code, "UNKNOWN_ERROR")
            error_body = {
                "code": error_code,
                "message": str(exc.detail) if exc.detail else f"HTTP {exc.status_code}",
            }

        return JSONResponse(
            status_code=exc.status_code,
            content={"error": error_body},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Handle Pydantic validation errors with field-level details."""
        field_errors = []
        for error in exc.errors():
            # Extract field name from loc (e.g., ['body', 'name'] -> 'name')
            loc = error.get("loc", [])
            field = loc[-1] if loc else "unknown"
            if field == "body":
                field = "request_body"

            field_errors.append({
                "field": str(field),
                "message": error.get("msg", "Validation error"),
                "type": error.get("type", "unknown"),
            })

        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Validation failed",
                    "details": field_errors,
                }
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        """Handle unhandled exceptions as 500 Internal Server Error."""
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An internal error occurred",
                }
            },
        )
