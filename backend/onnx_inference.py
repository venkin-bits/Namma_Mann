# backend/onnx_inference.py - ML inference via ONNX (placeholder until model trained)
import os
from pathlib import Path


def load_onnx_model():
    """Load ONNX model if exists, else return None for placeholder mode."""
    model_paths = [
        Path(__file__).parent / "soil_model.onnx",
        Path(__file__).parent.parent / "ml" / "soil_model.onnx",
        Path(os.getenv("ONNX_MODEL_PATH", "./soil_model.onnx")),
    ]
    for p in model_paths:
        if p.exists():
            try:
                import onnxruntime as ort
                return ort.InferenceSession(str(p), providers=["CPUExecutionProvider"])
            except Exception:
                pass
    return None


def predict_soil_health(pH: float, moisture: float, N: float, P: float, K: float) -> float:
    """
    Run ML inference. Returns 0-1 health score.
    Uses ONNX model if available, else rule-based heuristic.
    """
    session = load_onnx_model()
    if session is not None:
        import numpy as np
        inp = np.array([[pH, moisture, N, P, K]], dtype=np.float32)
        out = session.run(None, {session.get_inputs()[0].name: inp})
        return float(out[0][0][0])
    # Placeholder: compute heuristic score (TNAU-inspired)
    score = 0.5
    if 6.0 <= pH <= 7.5:
        score += 0.15
    elif 5.5 <= pH < 6.0 or 7.5 < pH <= 8.0:
        score += 0.05
    if N >= 25:
        score += 0.1
    if P >= 15:
        score += 0.1
    if K >= 40:
        score += 0.1
    if 20 <= moisture <= 60:
        score += 0.05
    return min(1.0, max(0.0, score))
