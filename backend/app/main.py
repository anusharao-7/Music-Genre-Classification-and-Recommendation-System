"""
Music Genre Classification API
FastAPI backend for audio genre classification and song recommendations.
"""
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import tempfile

from app.features.extractor import AudioFeatureExtractor
from app.models.classifier import GenreClassifier
from app.models.recommender import SongRecommender

# Initialize FastAPI app
app = FastAPI(
    title="Music Genre Classification API",
    description="Classify music genres from audio files and get song recommendations",
    version="1.0.0"
)

# CORS configuration - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML components
feature_extractor = AudioFeatureExtractor()
genre_classifier = GenreClassifier()
song_recommender = SongRecommender()


# Pydantic models for API responses
class GenreProbabilities(BaseModel):
    rock: float = 0.0
    pop: float = 0.0
    jazz: float = 0.0
    classical: float = 0.0
    hiphop: float = 0.0
    electronic: float = 0.0
    blues: float = 0.0
    country: float = 0.0
    metal: float = 0.0
    reggae: float = 0.0


class PredictionResult(BaseModel):
    genre: str
    confidence: float
    probabilities: GenreProbabilities


class Song(BaseModel):
    id: str
    title: str
    artist: str
    genre: str
    duration: str
    similarity: Optional[float] = None


class RecommendationResponse(BaseModel):
    prediction: PredictionResult
    recommendations: List[Song]


class SampleFile(BaseModel):
    id: str
    name: str
    genre: str


# Sample files for demo
SAMPLE_FILES = [
    {"id": "sample-1", "name": "Rock Guitar Riff.wav", "genre": "rock"},
    {"id": "sample-2", "name": "Jazz Piano Solo.wav", "genre": "jazz"},
    {"id": "sample-3", "name": "Electronic Beat.wav", "genre": "electronic"},
    {"id": "sample-4", "name": "Classical Violin.wav", "genre": "classical"},
    {"id": "sample-5", "name": "Hip Hop Beat.wav", "genre": "hiphop"},
]


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "API is running"}


@app.get("/api/samples", response_model=List[SampleFile])
async def get_sample_files():
    """Get list of available sample audio files."""
    return SAMPLE_FILES


@app.post("/api/predict", response_model=RecommendationResponse)
async def predict_genre(
    audio_file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None)
):
    """
    Predict the genre of an uploaded audio file or selected sample.
    Returns genre prediction with confidence and similar song recommendations.
    """
    if audio_file is None and sample_id is None:
        raise HTTPException(
            status_code=400, 
            detail="Please provide an audio file or select a sample"
        )
    
    try:
        # Handle uploaded file
        if audio_file:
            # Validate file type
            if not audio_file.content_type.startswith('audio/'):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid file type. Please upload an audio file."
                )
            
            # Save to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
                content = await audio_file.read()
                tmp.write(content)
                tmp_path = tmp.name
            
            try:
                # Extract features
                features = feature_extractor.extract(tmp_path)
                
                # Get prediction
                prediction = genre_classifier.predict(features)
                
                # Get recommendations
                recommendations = song_recommender.get_recommendations(
                    features=features,
                    genre=prediction["genre"],
                    top_k=3
                )
                
            finally:
                # Cleanup temp file
                os.unlink(tmp_path)
        
        # Handle sample file selection
        else:
            sample = next((s for s in SAMPLE_FILES if s["id"] == sample_id), None)
            if not sample:
                raise HTTPException(
                    status_code=404,
                    detail="Sample file not found"
                )
            
            # For demo: return mock prediction based on sample genre
            prediction = genre_classifier.predict_for_genre(sample["genre"])
            recommendations = song_recommender.get_recommendations(
                genre=sample["genre"],
                top_k=3
            )
        
        return {
            "prediction": prediction,
            "recommendations": recommendations
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
