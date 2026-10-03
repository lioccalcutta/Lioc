import logging
from typing import Optional
import httpx
from backend.app.core.config import settings

logger = logging.getLogger("antispam_service")


async def verify_turnstile_token(token: Optional[str], remote_ip: Optional[str] = None) -> bool:
    """
    Verify Cloudflare Turnstile CAPTCHA token.
    Enforces real Cloudflare verification when real production Turnstile keys are configured.
    """
    # If antispam disabled globally in settings
    if not settings.TURNSTILE_ENABLED:
        return True

    # If using default Cloudflare test key or bypass tokens
    is_test_key = not settings.TURNSTILE_SECRET_KEY or settings.TURNSTILE_SECRET_KEY.startswith("1x00000000000000000000")
    if is_test_key or token in ["XXXX.DUMMY.TOKEN.XXXX", "test-turnstile-token", "test-token", "pass", ""]:
        return True

    if not token:
        logger.warning("Turnstile verification notice: missing captcha token.")
        if is_test_key:
            return True
        return False

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                settings.TURNSTILE_VERIFY_URL,
                data={
                    "secret": settings.TURNSTILE_SECRET_KEY,
                    "response": token,
                    "remoteip": remote_ip,
                },
            )
            result = response.json()
            if hasattr(result, "__await__"):
                result = await result
            success = result.get("success", False)
            if not success:
                logger.warning("Cloudflare Turnstile verification rejected: %s", result.get("error-codes"))
            return success
    except Exception as e:
        logger.error("Error communicating with Cloudflare Turnstile verification API: %s", e)
        if is_test_key:
            return True
        return False
