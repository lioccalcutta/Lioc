"""
Lioc B2B Platform - Pytest Shared Test Configuration & Fixtures
"""

import sys
from pathlib import Path
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.main import app
from backend.app.database.seed import seed_database
from backend.app.core.rate_limit import limiter


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Ensure database has seed data for all test suites."""
    seed_database()
    yield


@pytest.fixture(autouse=True)
def mock_default_email_dispatch():
    """Prevent actual network SMTP dispatch during test executions."""
    with patch("backend.app.services.email_service.email_service._send_raw_email") as m:
        m.return_value = True
        yield m


@pytest.fixture(autouse=True)
def reset_rate_limits():
    """Reset SlowAPI in-memory rate limit counters before each test."""
    limiter.reset()
    yield


@pytest.fixture(scope="module")
def client():
    """Provide standard TestClient instance."""
    with TestClient(app) as test_client:
        yield test_client
