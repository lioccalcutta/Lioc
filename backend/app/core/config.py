from typing import List, Union, Optional
import json
import logging
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger("lioc.config")


class Settings(BaseSettings):
    PROJECT_NAME: str = "Lioc B2B Platform API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Environment & Debug
    ENVIRONMENT: str = "development" # "development", "staging", "production"
    DEBUG: bool = True

    # Database: Supports SQLite for local development and PostgreSQL for production
    DATABASE_URL: str = "sqlite:///./lioc.db"

    # WhatsApp Central Configuration
    WHATSAPP_NUMBER: str = "9007381804" # Primary Business WhatsApp Number

    # Contact Info Defaults
    COMPANY_NAME: str = "Lioc"
    COMPANY_EMAIL: str = "lioccalcutta@gmail.com"
    COMPANY_PHONE: str = "+91 90073 81804"
    COMPANY_SECONDARY_PHONE: str = "+91 80134 51653"
    COMPANY_ADDRESS: str = "156, PGH Shah Road, Jadavpur, Kolkata - 700032, West Bengal, India"

    # Email & Notification Settings
    NOTIFICATION_EMAIL: str = "lioccalcutta@gmail.com"
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "lioccalcutta@gmail.com"
    SMTP_PASSWORD: str = "" # Provide 16-character Gmail App Password in .env to enable live dispatch
    SMTP_TLS: bool = True
    EMAILS_ENABLED: bool = True

    # Security & Admin Authentication
    JWT_SECRET_KEY: str = "lioc-super-secret-jwt-key-for-development-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    ADMIN_EMAIL: str = "lioccalcutta@gmail.com"
    ADMIN_PASSWORD: Optional[str] = None
    ADMIN_PASSWORD_HASH: Optional[str] = None
    ADMIN_NAME: str = "Lioc Management (CEO)"
    ADMIN_ROLE: str = "Chief Executive Officer"

    # Anti-Spam (Cloudflare Turnstile)
    # Default is Cloudflare official test key (always passes in development)
    TURNSTILE_SECRET_KEY: str = "1x0000000000000000000000000000000AA"
    TURNSTILE_ENABLED: bool = True
    TURNSTILE_VERIFY_URL: str = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

    # Generative AI / Support Agent Configuration
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    AI_MODEL_NAME: str = "gemini-1.5-flash"

    # CORS Allowed Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def clean_database_url(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip().replace("\r", "").replace("\n", "")
        return v

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v_str = v.strip()
            if v_str.startswith("[") and v_str.endswith("]"):
                try:
                    return json.loads(v_str)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            return [str(origin).strip() for origin in v if str(origin).strip()]
        return ["http://localhost:3000", "http://127.0.0.1:3000"]

    def validate_production_configuration(self) -> List[str]:
        """
        Validates environment configuration for production safety.
        Returns a list of validation error messages.
        """
        errors = []
        if self.ENVIRONMENT.lower() == "production":
            if self.DEBUG:
                errors.append("DEBUG must be set to False in production.")
            if "sqlite" in self.DATABASE_URL.lower():
                errors.append("DATABASE_URL must be a production PostgreSQL database, not SQLite.")
            if self.JWT_SECRET_KEY == "lioc-super-secret-jwt-key-for-development-change-in-production" or len(self.JWT_SECRET_KEY) < 32:
                errors.append("JWT_SECRET_KEY must be a secure random string of at least 32 characters in production.")
            if "*" in self.BACKEND_CORS_ORIGINS:
                errors.append("BACKEND_CORS_ORIGINS cannot contain wildcard '*' when handling authenticated requests.")
        return errors

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
