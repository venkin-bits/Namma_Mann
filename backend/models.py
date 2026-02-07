# backend/models.py - Pydantic schemas for Namma Mann API
from pydantic import BaseModel, Field


class SoilInput(BaseModel):
    
    pH: float = Field(ge=3.5, le=10.0, description="Soil pH (3.5-10)")
    moisture: float = Field(default=50, ge=0, le=100, description="Moisture % (0-100)")
    N: float = Field(ge=0, le=500, description="Nitrogen ppm")
    P: float = Field(default=20, ge=0, le=200, description="Phosphorus ppm")
    K: float = Field(default=50, ge=0, le=500, description="Potassium ppm")


class SoilAnalysisResponse(BaseModel):
    
    recommendation: str
    ml_score: float
    tamil_recommendation: str | None = None


class ImageAnalysisInput(BaseModel):
    
    image: str  # data:image/jpeg;base64,... or raw base64


class ImageAnalysisResponse(BaseModel):
    predicted_ph: float
    predicted_NPK: dict
    moisture: float
    confidence: float
    recs: list[str] | None = None


class PestInput(BaseModel):
    crop: str
    pestSeverity: float = Field(ge=1, le=10)
    affectedArea: float = Field(ge=0, le=100)
    plantHealth: float = Field(ge=0, le=100)
    pestType: str
    diseaseStage: str
    district: str | None = None


class PestImageInput(BaseModel):
    image: str
    crop: str = "Rice"


class PestAnalysisResponse(BaseModel):
    pestSeverity: float
    affectedArea: float
    plantHealth: float
    pestType: str
    diseaseStage: str
