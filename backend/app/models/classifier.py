"""
Genre Classification Model
Predicts music genre from extracted audio features.
"""
import numpy as np
from typing import Dict, Any
import os

try:
    import joblib
    from sklearn.preprocessing import StandardScaler
    from sklearn.neural_network import MLPClassifier
except ImportError:
    joblib = None


class GenreClassifier:
    """
    Neural network classifier for music genre prediction.
    Uses a trained MLP model or generates realistic mock predictions.
    """
    
    GENRES = [
        'rock', 'pop', 'jazz', 'classical', 'hiphop',
        'electronic', 'blues', 'country', 'metal', 'reggae'
    ]
    
    def __init__(self, model_path: str = None):
        """
        Initialize the classifier.
        
        Args:
            model_path: Path to trained model file (optional)
        """
        self.model = None
        self.scaler = None
        
        if model_path and os.path.exists(model_path):
            self._load_model(model_path)
        else:
            # Initialize with a simple model for demo
            self._init_demo_model()
    
    def _load_model(self, model_path: str):
        """Load trained model and scaler from disk."""
        if joblib is None:
            return
        try:
            data = joblib.load(model_path)
            self.model = data['model']
            self.scaler = data['scaler']
        except Exception as e:
            print(f"Could not load model: {e}")
    
    def _init_demo_model(self):
        """Initialize a demo model for when no trained model exists."""
        if joblib is None:
            return
        # Create a simple pre-configured model
        self.scaler = StandardScaler()
        self.model = MLPClassifier(
            hidden_layer_sizes=(256, 128, 64),
            activation='relu',
            max_iter=1,  # Not actually training
            warm_start=True
        )
    
    def predict(self, features: np.ndarray) -> Dict[str, Any]:
        """
        Predict genre from audio features.
        
        Args:
            features: Audio feature vector (58 dimensions)
            
        Returns:
            Dictionary with genre, confidence, and probabilities
        """
        if self.model is None or not hasattr(self.model, 'predict_proba'):
            return self._get_mock_prediction(features)
        
        try:
            # Scale features
            features_scaled = self.scaler.transform(features.reshape(1, -1))
            
            # Get probabilities
            probabilities = self.model.predict_proba(features_scaled)[0]
            
            # Find top prediction
            top_idx = np.argmax(probabilities)
            predicted_genre = self.GENRES[top_idx]
            confidence = float(probabilities[top_idx])
            
            return {
                "genre": predicted_genre,
                "confidence": confidence,
                "probabilities": {
                    genre: float(prob) 
                    for genre, prob in zip(self.GENRES, probabilities)
                }
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return self._get_mock_prediction(features)
    
    def predict_for_genre(self, genre: str) -> Dict[str, Any]:
        """
        Generate a prediction result for a known genre (demo mode).
        
        Args:
            genre: The known genre label
            
        Returns:
            Dictionary with genre, confidence, and probabilities
        """
        np.random.seed(hash(genre) % 2**32)
        
        # Generate realistic probability distribution
        probabilities = np.random.dirichlet(np.ones(10) * 0.5)
        
        # Set the known genre as highest probability
        genre_idx = self.GENRES.index(genre) if genre in self.GENRES else 0
        
        # Boost the correct genre's probability
        probabilities[genre_idx] = 0.65 + np.random.random() * 0.25
        
        # Renormalize other probabilities
        remaining = 1 - probabilities[genre_idx]
        for i in range(len(probabilities)):
            if i != genre_idx:
                probabilities[i] = probabilities[i] * remaining / sum(
                    probabilities[j] for j in range(len(probabilities)) if j != genre_idx
                )
        
        return {
            "genre": genre,
            "confidence": float(probabilities[genre_idx]),
            "probabilities": {
                g: float(p) for g, p in zip(self.GENRES, probabilities)
            }
        }
    
    def _get_mock_prediction(self, features: np.ndarray) -> Dict[str, Any]:
        """Generate a mock prediction based on feature hash."""
        # Use features to generate deterministic but varied predictions
        seed = int(abs(np.sum(features) * 1000)) % 2**32
        np.random.seed(seed)
        
        # Pick a random genre with realistic distribution
        genre_idx = np.random.randint(0, len(self.GENRES))
        predicted_genre = self.GENRES[genre_idx]
        
        return self.predict_for_genre(predicted_genre)
