from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Closira Enquiry API"
    APP_VERSION: str = "1.0.0"
    DATABASE_URL: str = "sqlite+aiosqlite:///./closira.db"
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"


settings = Settings()