# backend/main.py - Namma Mann FastAPI API
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import (
    SoilInput,
    SoilAnalysisResponse,
    ImageAnalysisInput,
    ImageAnalysisResponse,
    PestInput,
    PestImageInput,
    PestAnalysisResponse,
)
from onnx_inference import predict_soil_health

app = FastAPI(
    title="Namma Mann API",
    description="மண் பரிசோதனை - Tamil Nadu Pest Analysis for Farmers",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_recommendations(soil: SoilInput) -> list[str]:
    
    recs: list[str] = []
    if soil.pH < 6.5:
        recs.append("🧪 Add lime")
    elif soil.pH > 7.5:
        recs.append("🧪 Add gypsum")
    if soil.N < 25:
        recs.append("🌱 Urea 50g/100sqft")
    elif soil.N >= 25 and soil.N < 50:
        recs.append("🌱 Light N top-dress")
    if soil.P < 15:
        recs.append("🌾 SSP/DAP for phosphorus")
    if soil.K < 40:
        recs.append("🥬 Muriate of potash (MOP)")
    if soil.moisture < 20:
        recs.append("💧 Low moisture - irrigate")
    elif soil.moisture > 80:
        recs.append("💧 Reduce waterlogging")
    return recs


def _tamil_recommendation(recs: list[str]) -> str:
    
    tamil_map = {
        "🧪 Add lime": "சுண்ணாம்பு சேர்க்கவும்",
        "🧪 Add gypsum": "ஜிப்சம் சேர்க்கவும்",
        "🌱 Urea 50g/100sqft": "யூரியா 50கிராம்/100சதுரஅடி",
        "🌾 SSP/DAP for phosphorus": "பாஸ்பரஸ் - SSP/DAP",
        "🥬 Muriate of potash (MOP)": "பொட்டாசியம் (MOP)",
        "💧 Low moisture - irrigate": "நீர்ப்பாசனம் செய்யுங்கள்",
        "💧 Reduce waterlogging": "நீர்த்தேக்கம் குறைக்கவும்",
    }
    def map_rec(r: str) -> str:
        for k, v in tamil_map.items():
            if k in r:
                return v
        return r
    return "; ".join(map_rec(r) for r in recs)


@app.get("/")
async def root():
    return {"message": "Namma Mann API - மண் பரிசோதனை", "docs": "/docs"}


@app.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image(body: ImageAnalysisInput):
    
    # TODO: Add image ML model (transfer learning / CNN)
    # For now: mock values based on placeholder
    import base64
    _ = body.image.split(",")[-1] if "," in body.image else body.image
    try:
        base64.b64decode(_, validate=True)
    except Exception:
        pass
    return ImageAnalysisResponse(
        predicted_ph=6.2,
        predicted_NPK={"N": 22.0, "P": 18.0, "K": 45.0},
        moisture=55.0,
        confidence=0.85,
        recs=["🧪 Add lime", "🌱 Light N top-dress"],
    )


MOCK_PEST_BY_CROP = {
    "Rice": {"pestSeverity": 4, "affectedArea": 15, "plantHealth": 72, "pestType": "Stem Borer", "diseaseStage": "Early"},
    "Sugarcane": {"pestSeverity": 3, "affectedArea": 8, "plantHealth": 85, "pestType": "Leafhopper", "diseaseStage": "Early"},
    "Cotton": {"pestSeverity": 6, "affectedArea": 25, "plantHealth": 58, "pestType": "Whitefly", "diseaseStage": "Mid"},
    "Tomato": {"pestSeverity": 5, "affectedArea": 20, "plantHealth": 62, "pestType": "Fruit Borer", "diseaseStage": "Mid"},
    "Chilli": {"pestSeverity": 4, "affectedArea": 12, "plantHealth": 78, "pestType": "Thrips", "diseaseStage": "Early"},
}


@app.post("/analyze-pest-image", response_model=PestAnalysisResponse)
async def analyze_pest_image(body: PestImageInput):
    m = MOCK_PEST_BY_CROP.get(body.crop, MOCK_PEST_BY_CROP["Rice"])
    return PestAnalysisResponse(**m)


@app.post("/analyze-pest")
async def analyze_pest(body: PestInput):
    recs = ["🔬 Apply neem oil spray", "🌿 Remove affected leaves", "💧 Increase irrigation"]
    return {
        "recommendation": "; ".join(recs),
        "tamil_recommendation": "வேப்ப எண்ணெய் தெளித்தல்; பாதிக்கப்பட்ட இலைகளை அகற்றுங்கள்.",
        "ml_score": round(body.plantHealth / 100, 2),
    }


@app.post("/analyze", response_model=SoilAnalysisResponse)
async def analyze(soil: SoilInput):
    recs = _get_recommendations(soil)
    recommendation = "; ".join(recs) if recs else "✅ Good!"
    tamil_rec = _tamil_recommendation(recs) if recs else "✅ சரி!"
    ml_score = predict_soil_health(soil.pH, soil.moisture, soil.N, soil.P, soil.K)
    return SoilAnalysisResponse(
        recommendation=recommendation,
        ml_score=round(ml_score, 2),
        tamil_recommendation=tamil_rec,
    )
