import sys
import logging
import types
from pathlib import Path
from contextlib import asynccontextmanager

# Robust path and package resolution for Local, Render, and Docker deployments
_APP_DIR = Path(__file__).resolve().parent
_BACKEND_DIR = _APP_DIR.parent
_REPO_ROOT = _BACKEND_DIR.parent

for p in [_REPO_ROOT, _BACKEND_DIR, _APP_DIR]:
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

if "backend" not in sys.modules:
    backend_module = types.ModuleType("backend")
    backend_module.__path__ = [str(_BACKEND_DIR)]
    sys.modules["backend"] = backend_module

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from slowapi.errors import RateLimitExceeded

from backend.app.core.config import settings
from backend.app.core.logging_config import setup_logging
from backend.app.core.rate_limit import limiter, rate_limit_exceeded_handler
from backend.app.middleware.request_id import RequestIdMiddleware
from backend.app.api.v1.api import api_router
from backend.app.database.seed import seed_database

# Initialize structured logging
setup_logging()
logger = logging.getLogger("lioc.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Lioc Platform Backend (Version: %s, Env: %s)...", settings.VERSION, settings.ENVIRONMENT)

    # Validate production environment settings
    prod_errors = settings.validate_production_configuration()
    if prod_errors:
        for err in prod_errors:
            logger.error("CRITICAL PRODUCTION CONFIG ERROR: %s", err)
        if settings.ENVIRONMENT.lower() == "production":
            raise RuntimeError(f"Production configuration validation failed: {'; '.join(prod_errors)}")

    # Startup: Ensure database seed data exists in dev or initial setup (never destructively reseed in production)
    try:
        seed_database(force_reseed=False)
        logger.info("Database connection and seed data verified successfully.")
    except Exception as e:
        logger.warning("Database startup notice: %s", e)
    yield
    logger.info("Lioc Platform Backend shutting down cleanly.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.DEBUG else None,
    docs_url=f"{settings.API_V1_STR}/docs" if settings.DEBUG else None,
    redoc_url=f"{settings.API_V1_STR}/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# Attach rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Request ID & Performance Tracing Middleware
app.add_middleware(RequestIdMiddleware)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Process-Time"],
)


# Global Exception Handlers for Production Resilience
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    request_id = getattr(request.state, "request_id", "N/A")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail,
                "request_id": request_id,
            }
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    request_id = getattr(request.state, "request_id", "N/A")
    # Simplify error details for clarity
    errors = []
    for err in exc.errors():
        field = " -> ".join([str(loc) for loc in err.get("loc", [])])
        errors.append({"field": field, "message": err.get("msg", "Invalid value")})

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "The request payload failed validation.",
                "details": errors,
                "request_id": request_id,
            }
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "N/A")
    logger.exception("[%s] Unhandled Server Error: %s", request_id, exc)

    # In production, never leak internal traceback
    message = str(exc) if settings.DEBUG else "An unexpected internal server error occurred. Please contact Lioc support."
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": message,
                "request_id": request_id,
            }
        },
    )


# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "status": "operational",
    }

