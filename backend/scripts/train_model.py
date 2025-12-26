"""
Model Training Script
Trains the genre classification model on audio features.
"""
import numpy as np
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler, LabelEncoder
    from sklearn.neural_network import MLPClassifier
    from sklearn.metrics import classification_report, accuracy_score
    import joblib
except ImportError:
    print("Please install scikit-learn: pip install scikit-learn joblib")
    sys.exit(1)


GENRES = [
    'rock', 'pop', 'jazz', 'classical', 'hiphop',
    'electronic', 'blues', 'country', 'metal', 'reggae'
]

N_FEATURES = 58
SAMPLES_PER_GENRE = 100


def generate_synthetic_data(n_samples_per_genre: int = 100):
    """
    Generate synthetic training data for demonstration.
    In production, this would load real extracted features.
    """
    print("Generating synthetic training data...")
    
    X = []
    y = []
    
    for genre_idx, genre in enumerate(GENRES):
        # Generate genre-specific feature distributions
        np.random.seed(genre_idx * 42)
        
        for _ in range(n_samples_per_genre):
            # Create base features with genre-specific characteristics
            features = np.random.randn(N_FEATURES)
            
            # Add genre-specific patterns
            if genre == 'rock':
                features[0:5] += 2  # Higher low-frequency MFCCs
                features[-1] = 120 + np.random.randn() * 20  # Higher tempo
            elif genre == 'classical':
                features[10:15] += 1.5  # More harmonic content
                features[-1] = 80 + np.random.randn() * 30  # Variable tempo
            elif genre == 'electronic':
                features[32:35] += 2  # Higher spectral features
                features[-1] = 128 + np.random.randn() * 10  # Steady tempo
            elif genre == 'jazz':
                features[20:32] += 1  # Rich chroma
                features[-1] = 100 + np.random.randn() * 40  # Variable tempo
            elif genre == 'hiphop':
                features[0:10] += 1.5  # Strong bass
                features[-1] = 90 + np.random.randn() * 15  # Hip hop tempo
            elif genre == 'metal':
                features[32:35] += 3  # High spectral centroid
                features[35] += 2  # High zero crossing rate
                features[-1] = 140 + np.random.randn() * 30  # Fast tempo
            elif genre == 'blues':
                features[5:15] += 1  # Soulful MFCCs
                features[-1] = 80 + np.random.randn() * 20  # Slower tempo
            elif genre == 'country':
                features[20:32] += 0.8  # Guitar harmonics
                features[-1] = 110 + np.random.randn() * 20
            elif genre == 'pop':
                features[32:35] += 1.2  # Bright sound
                features[-1] = 120 + np.random.randn() * 15
            elif genre == 'reggae':
                features[0:5] += 1.5  # Bass-heavy
                features[-1] = 80 + np.random.randn() * 10  # Slower tempo
            
            X.append(features)
            y.append(genre)
    
    return np.array(X), np.array(y)


def train_model():
    """Train the genre classification model."""
    print("=" * 50)
    print("Music Genre Classification - Model Training")
    print("=" * 50)
    
    # Generate or load data
    X, y = generate_synthetic_data(SAMPLES_PER_GENRE)
    print(f"\nDataset size: {len(X)} samples, {N_FEATURES} features")
    print(f"Classes: {len(GENRES)}")
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    print(f"Training samples: {len(X_train)}")
    print(f"Test samples: {len(X_test)}")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("\nTraining neural network...")
    model = MLPClassifier(
        hidden_layer_sizes=(256, 128, 64),
        activation='relu',
        solver='adam',
        alpha=0.001,
        batch_size='auto',
        learning_rate='adaptive',
        learning_rate_init=0.001,
        max_iter=500,
        shuffle=True,
        random_state=42,
        early_stopping=True,
        validation_fraction=0.1,
        n_iter_no_change=20,
        verbose=True
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    print("\n" + "=" * 50)
    print("Model Evaluation")
    print("=" * 50)
    
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nTest Accuracy: {accuracy:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(
        y_test, y_pred, 
        target_names=GENRES
    ))
    
    # Save model
    model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'genre_classifier.joblib')
    
    joblib.dump({
        'model': model,
        'scaler': scaler,
        'label_encoder': label_encoder,
        'genres': GENRES
    }, model_path)
    
    print(f"\nModel saved to: {model_path}")
    print("=" * 50)
    
    return model, scaler


if __name__ == "__main__":
    train_model()
