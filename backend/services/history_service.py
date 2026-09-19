import datetime
from typing import Optional, List, Tuple
from database import get_db
from config import DEVICE_HEARTBEAT_TIMEOUT, MODEL_NAME

class HistoryService:
    @staticmethod
    def record_prediction(
        timestamp: str,
        source: str,
        image_filename: Optional[str],
        prediction: str,
        confidence: float,
        prob_deer: float,
        prob_tiger: float,
        prob_wolf: float,
        inference_time_ms: float,
        device: Optional[str] = None
    ) -> dict:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO predictions (
                    timestamp, source, image_filename, prediction, confidence,
                    prob_deer, prob_tiger, prob_wolf, inference_time_ms, model_name, device
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                timestamp, source, image_filename, prediction, confidence,
                prob_deer, prob_tiger, prob_wolf, inference_time_ms, MODEL_NAME, device
            ))
            pred_id = cursor.lastrowid
            
        return {
            "id": pred_id,
            "timestamp": timestamp,
            "source": source,
            "image_filename": image_filename,
            "prediction": prediction,
            "confidence": confidence,
            "probabilities": {
                "Deer": prob_deer,
                "Tiger": prob_tiger,
                "Wolf": prob_wolf
            },
            "inference_time_ms": inference_time_ms,
            "model": MODEL_NAME,
            "device": device,
            "image_url": f"/uploads/{image_filename}" if image_filename else None
        }

    @staticmethod
    def get_history(
        source: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[int, List[dict]]:
        with get_db() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM predictions WHERE 1=1"
            count_query = "SELECT COUNT(*) FROM predictions WHERE 1=1"
            params = []
            
            if source and source.lower() != "all":
                query += " AND LOWER(source) = ?"
                count_query += " AND LOWER(source) = ?"
                params.append(source.lower())
                
            if search:
                search_term = f"%{search.lower()}%"
                query += " AND (LOWER(prediction) LIKE ? OR LOWER(source) LIKE ? OR LOWER(image_filename) LIKE ?)"
                count_query += " AND (LOWER(prediction) LIKE ? OR LOWER(source) LIKE ? OR LOWER(image_filename) LIKE ?)"
                params.extend([search_term, search_term, search_term])
                
            cursor.execute(count_query, params)
            total = cursor.fetchone()[0]
            
            query += " ORDER BY id DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])
            cursor.execute(query, params)
            rows = cursor.fetchall()

            items = [
                {
                    "id": r["id"],
                    "timestamp": r["timestamp"],
                    "source": r["source"],
                    "image_filename": r["image_filename"],
                    "prediction": r["prediction"],
                    "confidence": r["confidence"],
                    "probabilities": {
                        "Deer": r["prob_deer"],
                        "Tiger": r["prob_tiger"],
                        "Wolf": r["prob_wolf"]
                    },
                    "inference_time_ms": r["inference_time_ms"],
                    "model": r["model_name"],
                    "device": r["device"],
                    "image_url": f"/uploads/{r['image_filename']}" if r["image_filename"] else None
                }
                for r in rows
            ]
            return total, items

    @staticmethod
    def clear_history() -> int:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM predictions")
            count = cursor.fetchone()[0]
            cursor.execute("DELETE FROM predictions")
            return count

    @staticmethod
    def register_hardware(device_id: str, ip_address: Optional[str], camera_type: Optional[str], status: str = "CONNECTED"):
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        with get_db() as conn:
            conn.execute("""
                INSERT INTO hardware_telemetry (device_id, last_seen, ip_address, camera_status, network_status, device_status)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(device_id) DO UPDATE SET
                    last_seen=excluded.last_seen,
                    ip_address=COALESCE(excluded.ip_address, hardware_telemetry.ip_address),
                    camera_status=excluded.camera_status,
                    network_status=excluded.network_status,
                    device_status=excluded.device_status
            """, (device_id, now, ip_address, "ACTIVE", "CONNECTED", status))

    @staticmethod
    def get_hardware_status() -> dict:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM hardware_telemetry ORDER BY last_seen DESC LIMIT 1")
            row = cursor.fetchone()
            
            # Find latest prediction originating from raspberry_pi
            cursor.execute("""
                SELECT * FROM predictions 
                WHERE LOWER(source) = 'raspberry_pi' 
                ORDER BY id DESC LIMIT 1
            """)
            latest_pred_row = cursor.fetchone()

        latest_prediction = None
        if latest_pred_row:
            latest_prediction = {
                "id": latest_pred_row["id"],
                "timestamp": latest_pred_row["timestamp"],
                "source": latest_pred_row["source"],
                "image_filename": latest_pred_row["image_filename"],
                "prediction": latest_pred_row["prediction"],
                "confidence": latest_pred_row["confidence"],
                "probabilities": {
                    "Deer": latest_pred_row["prob_deer"],
                    "Tiger": latest_pred_row["prob_tiger"],
                    "Wolf": latest_pred_row["prob_wolf"]
                },
                "inference_time_ms": latest_pred_row["inference_time_ms"],
                "model": latest_pred_row["model_name"],
                "device": latest_pred_row["device"],
                "image_url": f"/uploads/{latest_pred_row['image_filename']}" if latest_pred_row["image_filename"] else None
            }

        if not row:
            return {
                "device_status": "WAITING FOR DEVICE",
                "camera_status": "WAITING",
                "network_status": "WAITING",
                "last_seen": None,
                "latest_prediction": latest_prediction
            }

        # Check heartbeat timeout
        try:
            last_seen_dt = datetime.datetime.fromisoformat(row["last_seen"])
            now_dt = datetime.datetime.now(datetime.timezone.utc)
            seconds_diff = (now_dt - last_seen_dt).total_seconds()
            
            if seconds_diff <= DEVICE_HEARTBEAT_TIMEOUT:
                return {
                    "device_status": row["device_status"],
                    "camera_status": row["camera_status"],
                    "network_status": row["network_status"],
                    "last_seen": row["last_seen"],
                    "latest_prediction": latest_prediction
                }
            else:
                return {
                    "device_status": "WAITING FOR DEVICE",
                    "camera_status": "WAITING",
                    "network_status": "WAITING",
                    "last_seen": row["last_seen"],
                    "latest_prediction": latest_prediction
                }
        except Exception:
            return {
                "device_status": "WAITING FOR DEVICE",
                "camera_status": "WAITING",
                "network_status": "WAITING",
                "last_seen": row["last_seen"],
                "latest_prediction": latest_prediction
            }

history_service = HistoryService()
