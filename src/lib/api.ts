import { Genre, RecommendationResult } from '@/types/music';
import { simulatePrediction, SAMPLE_AUDIO_FILES } from './mockData';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = !import.meta.env.VITE_API_URL; // Use mock if no API URL configured

export async function predictGenre(
  file: File | null,
  sampleId?: string
): Promise<RecommendationResult> {
  // If using mock mode (no backend), simulate the prediction
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000)); // Simulate processing
    
    if (sampleId) {
      const sample = SAMPLE_AUDIO_FILES.find(s => s.id === sampleId);
      return simulatePrediction(sample?.genre);
    }
    
    return simulatePrediction();
  }

  // Real API call
  const formData = new FormData();
  
  if (file) {
    formData.append('audio_file', file);
  } else if (sampleId) {
    formData.append('sample_id', sampleId);
  } else {
    throw new Error('Please provide an audio file or select a sample');
  }

  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Failed to predict genre');
  }

  return response.json();
}

export async function getSampleFiles() {
  if (USE_MOCK) {
    return SAMPLE_AUDIO_FILES;
  }

  const response = await fetch(`${API_BASE_URL}/api/samples`);
  if (!response.ok) {
    throw new Error('Failed to fetch sample files');
  }
  return response.json();
}

export async function healthCheck(): Promise<boolean> {
  if (USE_MOCK) {
    return true;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
