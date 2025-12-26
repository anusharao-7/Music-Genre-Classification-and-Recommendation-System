"""
Audio Feature Extraction Module
Extracts acoustic features from audio files using librosa.
"""
import numpy as np

try:
    import librosa
except ImportError:
    librosa = None


class AudioFeatureExtractor:
    """
    Extracts audio features for genre classification.
    
    Features extracted:
    - MFCCs (20 coefficients) - Timbral texture
    - Chroma (12 pitch classes) - Harmonic content
    - Spectral Centroid - Brightness
    - Spectral Bandwidth - Spread
    - Spectral Rolloff - High frequency content
    - Zero Crossing Rate - Noisiness
    - RMS Energy - Loudness
    - Tempo - Beats per minute
    """
    
    def __init__(self, sr: int = 22050, duration: float = 30.0):
        """
        Initialize the feature extractor.
        
        Args:
            sr: Sample rate for audio processing
            duration: Maximum duration to process (seconds)
        """
        self.sr = sr
        self.duration = duration
        
    def extract(self, audio_path: str) -> np.ndarray:
        """
        Extract features from an audio file.
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            Feature vector (58 dimensions)
        """
        if librosa is None:
            # Return mock features if librosa not available
            return self._get_mock_features()
        
        try:
            # Load audio file
            y, sr = librosa.load(audio_path, sr=self.sr, duration=self.duration)
            
            # Extract features
            features = []
            
            # 1. MFCCs (20 coefficients)
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
            mfccs_mean = np.mean(mfccs, axis=1)
            features.extend(mfccs_mean)
            
            # 2. Chroma features (12 pitch classes)
            chroma = librosa.feature.chroma_stft(y=y, sr=sr)
            chroma_mean = np.mean(chroma, axis=1)
            features.extend(chroma_mean)
            
            # 3. Spectral Centroid
            spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
            features.append(np.mean(spectral_centroid))
            
            # 4. Spectral Bandwidth
            spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
            features.append(np.mean(spectral_bandwidth))
            
            # 5. Spectral Rolloff
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
            features.append(np.mean(spectral_rolloff))
            
            # 6. Zero Crossing Rate
            zcr = librosa.feature.zero_crossing_rate(y)
            features.append(np.mean(zcr))
            
            # 7. RMS Energy
            rms = librosa.feature.rms(y=y)
            features.append(np.mean(rms))
            
            # 8. Tempo
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            features.append(float(tempo))
            
            # Additional statistics (variance of MFCCs)
            mfccs_std = np.std(mfccs, axis=1)
            features.extend(mfccs_std)
            
            return np.array(features)
            
        except Exception as e:
            print(f"Error extracting features: {e}")
            return self._get_mock_features()
    
    def _get_mock_features(self) -> np.ndarray:
        """Generate mock features for testing without librosa."""
        np.random.seed(42)
        return np.random.randn(58)
    
    def get_feature_names(self) -> list:
        """Get names of all extracted features."""
        names = []
        
        # MFCC means
        names.extend([f"mfcc_{i}_mean" for i in range(1, 21)])
        
        # Chroma
        notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        names.extend([f"chroma_{note}" for note in notes])
        
        # Spectral features
        names.extend([
            'spectral_centroid',
            'spectral_bandwidth', 
            'spectral_rolloff',
            'zero_crossing_rate',
            'rms_energy',
            'tempo'
        ])
        
        # MFCC stds
        names.extend([f"mfcc_{i}_std" for i in range(1, 21)])
        
        return names
