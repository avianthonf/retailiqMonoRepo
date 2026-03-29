#!/usr/bin/env python3
"""Wait for PostgreSQL to be ready before starting the app."""

import logging
import os
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import LOCAL_POSTGRES_DOCKER_HOST, build_postgres_url

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
logger = logging.getLogger(__name__)

MAX_RETRIES = 30
RETRY_INTERVAL = 2


def wait_for_db():
    db_url = os.environ.get("DATABASE_URL") or build_postgres_url(host=LOCAL_POSTGRES_DOCKER_HOST)
    if not db_url:
        logger.warning("DATABASE_URL not set, skipping DB wait")
        return

    # Fix postgres:// -> postgresql://
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    try:
        import sqlalchemy as sa

        engine = sa.create_engine(db_url, pool_pre_ping=True)
    except Exception as e:
        logger.error("Could not create engine: %s", e)
        sys.exit(1)

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            with engine.connect() as conn:
                conn.execute(sa.text("SELECT 1"))
            logger.info("Database is ready (attempt %d/%d)", attempt, MAX_RETRIES)
            return
        except Exception as e:
            logger.info("Waiting for database... attempt %d/%d (%s)", attempt, MAX_RETRIES, e)
            time.sleep(RETRY_INTERVAL)

    logger.error("Database not ready after %d attempts, exiting.", MAX_RETRIES)
    sys.exit(1)


if __name__ == "__main__":
    wait_for_db()
