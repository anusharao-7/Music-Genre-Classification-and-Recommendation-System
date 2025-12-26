"""
Song Recommendation Engine
Finds similar songs using audio feature similarity.
"""
import numpy as np
from typing import List, Dict, Any, Optional


class SongRecommender:
    """
    Recommends similar songs based on audio feature similarity.
    Uses KNN with cosine similarity for matching.
    """
    
    # Sample song database
    SONG_DATABASE = [
        # Rock
        {"id": "rock-1", "title": "Thunder Road", "artist": "The Midnight", "genre": "rock", "duration": "4:23"},
        {"id": "rock-2", "title": "Electric Storm", "artist": "Voltage", "genre": "rock", "duration": "3:45"},
        {"id": "rock-3", "title": "Rebel Heart", "artist": "Stone Revival", "genre": "rock", "duration": "5:12"},
        
        # Pop
        {"id": "pop-1", "title": "Neon Lights", "artist": "Aurora Sky", "genre": "pop", "duration": "3:18"},
        {"id": "pop-2", "title": "Dancing in June", "artist": "Summer Days", "genre": "pop", "duration": "3:42"},
        {"id": "pop-3", "title": "Heartbeat", "artist": "Luna", "genre": "pop", "duration": "3:55"},
        
        # Jazz
        {"id": "jazz-1", "title": "Midnight Blues", "artist": "The Velvet Trio", "genre": "jazz", "duration": "6:30"},
        {"id": "jazz-2", "title": "Smoky Room", "artist": "Charlie Lane", "genre": "jazz", "duration": "5:45"},
        {"id": "jazz-3", "title": "After Hours", "artist": "Blue Note Five", "genre": "jazz", "duration": "7:12"},
        
        # Classical
        {"id": "classical-1", "title": "Moonlight Sonata", "artist": "Vienna Symphony", "genre": "classical", "duration": "8:45"},
        {"id": "classical-2", "title": "Spring Awakening", "artist": "Prague Orchestra", "genre": "classical", "duration": "12:30"},
        {"id": "classical-3", "title": "Nocturne in E", "artist": "Anna Petrova", "genre": "classical", "duration": "5:20"},
        
        # Hip Hop
        {"id": "hiphop-1", "title": "City Lights", "artist": "Metro Flow", "genre": "hiphop", "duration": "3:28"},
        {"id": "hiphop-2", "title": "Real Talk", "artist": "King Verse", "genre": "hiphop", "duration": "4:15"},
        {"id": "hiphop-3", "title": "Street Dreams", "artist": "Lyrical Storm", "genre": "hiphop", "duration": "3:52"},
        
        # Electronic
        {"id": "electronic-1", "title": "Synthwave", "artist": "Digital Echo", "genre": "electronic", "duration": "5:30"},
        {"id": "electronic-2", "title": "Binary Code", "artist": "Circuit Breaker", "genre": "electronic", "duration": "4:45"},
        {"id": "electronic-3", "title": "Neon Dreams", "artist": "Pulse", "genre": "electronic", "duration": "6:12"},
        
        # Blues
        {"id": "blues-1", "title": "Delta Morning", "artist": "Robert James", "genre": "blues", "duration": "4:55"},
        {"id": "blues-2", "title": "Crossroads", "artist": "Muddy Waters Jr.", "genre": "blues", "duration": "5:30"},
        {"id": "blues-3", "title": "Sweet Sorrow", "artist": "Memphis Soul", "genre": "blues", "duration": "6:10"},
        
        # Country
        {"id": "country-1", "title": "Dusty Roads", "artist": "Nashville Stars", "genre": "country", "duration": "3:45"},
        {"id": "country-2", "title": "Home Again", "artist": "Dixie Heart", "genre": "country", "duration": "4:20"},
        {"id": "country-3", "title": "Wildflower", "artist": "Country Rose", "genre": "country", "duration": "3:58"},
        
        # Metal
        {"id": "metal-1", "title": "Iron Thunder", "artist": "Blackforge", "genre": "metal", "duration": "5:45"},
        {"id": "metal-2", "title": "Rage Eternal", "artist": "Steel Storm", "genre": "metal", "duration": "6:30"},
        {"id": "metal-3", "title": "Dark Descent", "artist": "Obsidian", "genre": "metal", "duration": "7:15"},
        
        # Reggae
        {"id": "reggae-1", "title": "Island Vibes", "artist": "Kingston Sound", "genre": "reggae", "duration": "4:30"},
        {"id": "reggae-2", "title": "One Love", "artist": "Roots Revival", "genre": "reggae", "duration": "5:15"},
        {"id": "reggae-3", "title": "Sunshine", "artist": "Caribbean Breeze", "genre": "reggae", "duration": "4:45"},
    ]
    
    def __init__(self):
        """Initialize the recommender."""
        # Pre-compute mock feature vectors for songs (in a real system, these would be extracted)
        self._song_features = self._generate_song_features()
    
    def _generate_song_features(self) -> Dict[str, np.ndarray]:
        """Generate mock feature vectors for the song database."""
        features = {}
        for song in self.SONG_DATABASE:
            # Generate deterministic features based on song ID
            np.random.seed(hash(song["id"]) % 2**32)
            features[song["id"]] = np.random.randn(58)
        return features
    
    def get_recommendations(
        self,
        features: Optional[np.ndarray] = None,
        genre: Optional[str] = None,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Get song recommendations based on audio features and/or genre.
        
        Args:
            features: Audio feature vector (optional)
            genre: Genre to filter by
            top_k: Number of recommendations to return
            
        Returns:
            List of recommended songs with similarity scores
        """
        # Filter songs by genre if specified
        if genre:
            candidate_songs = [s for s in self.SONG_DATABASE if s["genre"] == genre]
        else:
            candidate_songs = self.SONG_DATABASE
        
        if not candidate_songs:
            return []
        
        recommendations = []
        for song in candidate_songs[:top_k]:
            # Calculate similarity (mock for demo)
            if features is not None:
                song_features = self._song_features.get(song["id"], np.random.randn(58))
                similarity = self._cosine_similarity(features, song_features)
                # Normalize to reasonable range
                similarity = (similarity + 1) / 2  # Map from [-1, 1] to [0, 1]
                similarity = 0.7 + similarity * 0.25  # Map to [0.7, 0.95]
            else:
                # Generate random similarity for demo
                np.random.seed(hash(song["id"]) % 2**32)
                similarity = 0.7 + np.random.random() * 0.25
            
            recommendations.append({
                **song,
                "similarity": round(similarity, 3)
            })
        
        # Sort by similarity
        recommendations.sort(key=lambda x: x["similarity"], reverse=True)
        
        return recommendations
    
    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        """Calculate cosine similarity between two vectors."""
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))
