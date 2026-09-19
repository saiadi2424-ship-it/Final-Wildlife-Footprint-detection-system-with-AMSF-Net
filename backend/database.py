import sqlite3
from contextlib import contextmanager
from datetime import datetime
from config import DB_PATH

def get_connection():
    """Returns a SQLite connection configured with WAL mode and row factory."""
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    return conn

@contextmanager
def get_db():
    """Context manager for safe database transactions."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Initializes tables for predictions and hardware telemetry."""
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                source TEXT NOT NULL,
                image_filename TEXT,
                prediction TEXT NOT NULL,
                confidence REAL NOT NULL,
                prob_deer REAL NOT NULL,
                prob_tiger REAL NOT NULL,
                prob_wolf REAL NOT NULL,
                inference_time_ms REAL NOT NULL,
                model_name TEXT NOT NULL,
                device TEXT
            );
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_predictions_timestamp 
            ON predictions(timestamp DESC);
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_predictions_source 
            ON predictions(source);
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS hardware_telemetry (
                device_id TEXT PRIMARY KEY,
                last_seen TEXT NOT NULL,
                ip_address TEXT,
                camera_status TEXT NOT NULL,
                network_status TEXT NOT NULL,
                device_status TEXT NOT NULL
            );
        """)
