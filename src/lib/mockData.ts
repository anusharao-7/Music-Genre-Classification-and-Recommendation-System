import { Genre, Song, RecommendationResult } from '@/types/music';

// Sample song database for demo mode
export const SAMPLE_SONGS: Song[] = [
  // Rock
  { id: 'rock-1', title: 'Thunder Road', artist: 'The Midnight', genre: 'rock', duration: '4:23' },
  { id: 'rock-2', title: 'Electric Storm', artist: 'Voltage', genre: 'rock', duration: '3:45' },
  { id: 'rock-3', title: 'Rebel Heart', artist: 'Stone Revival', genre: 'rock', duration: '5:12' },
  
  // Pop
  { id: 'pop-1', title: 'Neon Lights', artist: 'Aurora Sky', genre: 'pop', duration: '3:18' },
  { id: 'pop-2', title: 'Dancing in June', artist: 'Summer Days', genre: 'pop', duration: '3:42' },
  { id: 'pop-3', title: 'Heartbeat', artist: 'Luna', genre: 'pop', duration: '3:55' },
  
  // Jazz
  { id: 'jazz-1', title: 'Midnight Blues', artist: 'The Velvet Trio', genre: 'jazz', duration: '6:30' },
  { id: 'jazz-2', title: 'Smoky Room', artist: 'Charlie Lane', genre: 'jazz', duration: '5:45' },
  { id: 'jazz-3', title: 'After Hours', artist: 'Blue Note Five', genre: 'jazz', duration: '7:12' },
  
  // Classical
  { id: 'classical-1', title: 'Moonlight Sonata', artist: 'Vienna Symphony', genre: 'classical', duration: '8:45' },
  { id: 'classical-2', title: 'Spring Awakening', artist: 'Prague Orchestra', genre: 'classical', duration: '12:30' },
  { id: 'classical-3', title: 'Nocturne in E', artist: 'Anna Petrova', genre: 'classical', duration: '5:20' },
  
  // Hip Hop
  { id: 'hiphop-1', title: 'City Lights', artist: 'Metro Flow', genre: 'hiphop', duration: '3:28' },
  { id: 'hiphop-2', title: 'Real Talk', artist: 'King Verse', genre: 'hiphop', duration: '4:15' },
  { id: 'hiphop-3', title: 'Street Dreams', artist: 'Lyrical Storm', genre: 'hiphop', duration: '3:52' },
  
  // Electronic
  { id: 'electronic-1', title: 'Synthwave', artist: 'Digital Echo', genre: 'electronic', duration: '5:30' },
  { id: 'electronic-2', title: 'Binary Code', artist: 'Circuit Breaker', genre: 'electronic', duration: '4:45' },
  { id: 'electronic-3', title: 'Neon Dreams', artist: 'Pulse', genre: 'electronic', duration: '6:12' },
  
  // Blues
  { id: 'blues-1', title: 'Delta Morning', artist: 'Robert James', genre: 'blues', duration: '4:55' },
  { id: 'blues-2', title: 'Crossroads', artist: 'Muddy Waters Jr.', genre: 'blues', duration: '5:30' },
  { id: 'blues-3', title: 'Sweet Sorrow', artist: 'Memphis Soul', genre: 'blues', duration: '6:10' },
  
  // Country
  { id: 'country-1', title: 'Dusty Roads', artist: 'Nashville Stars', genre: 'country', duration: '3:45' },
  { id: 'country-2', title: 'Home Again', artist: 'Dixie Heart', genre: 'country', duration: '4:20' },
  { id: 'country-3', title: 'Wildflower', artist: 'Country Rose', genre: 'country', duration: '3:58' },
  
  // Metal
  { id: 'metal-1', title: 'Iron Thunder', artist: 'Blackforge', genre: 'metal', duration: '5:45' },
  { id: 'metal-2', title: 'Rage Eternal', artist: 'Steel Storm', genre: 'metal', duration: '6:30' },
  { id: 'metal-3', title: 'Dark Descent', artist: 'Obsidian', genre: 'metal', duration: '7:15' },
  
  // Reggae
  { id: 'reggae-1', title: 'Island Vibes', artist: 'Kingston Sound', genre: 'reggae', duration: '4:30' },
  { id: 'reggae-2', title: 'One Love', artist: 'Roots Revival', genre: 'reggae', duration: '5:15' },
  { id: 'reggae-3', title: 'Sunshine', artist: 'Caribbean Breeze', genre: 'reggae', duration: '4:45' },
];

// Sample audio files for testing
export const SAMPLE_AUDIO_FILES = [
  { id: 'sample-1', name: 'Rock Guitar Riff.wav', genre: 'rock' as Genre },
  { id: 'sample-2', name: 'Jazz Piano Solo.wav', genre: 'jazz' as Genre },
  { id: 'sample-3', name: 'Electronic Beat.wav', genre: 'electronic' as Genre },
  { id: 'sample-4', name: 'Classical Violin.wav', genre: 'classical' as Genre },
  { id: 'sample-5', name: 'Hip Hop Beat.wav', genre: 'hiphop' as Genre },
];

// Simulate genre prediction with realistic probabilities
export function simulatePrediction(selectedGenre?: Genre): RecommendationResult {
  const genres: Genre[] = ['rock', 'pop', 'jazz', 'classical', 'hiphop', 'electronic', 'blues', 'country', 'metal', 'reggae'];
  
  // If a genre is preselected (sample file), use that with high confidence
  const predictedGenre = selectedGenre || genres[Math.floor(Math.random() * genres.length)];
  
  // Generate realistic probability distribution
  const probabilities: Record<Genre, number> = {} as Record<Genre, number>;
  let remaining = 1;
  
  // Assign highest probability to predicted genre
  const mainProb = 0.65 + Math.random() * 0.25; // 65-90%
  probabilities[predictedGenre] = mainProb;
  remaining -= mainProb;
  
  // Distribute remaining probability among other genres
  const otherGenres = genres.filter(g => g !== predictedGenre);
  otherGenres.forEach((genre, index) => {
    if (index === otherGenres.length - 1) {
      probabilities[genre] = Math.max(0, remaining);
    } else {
      const prob = Math.random() * remaining * 0.5;
      probabilities[genre] = prob;
      remaining -= prob;
    }
  });
  
  // Get recommendations for the predicted genre
  const genreSongs = SAMPLE_SONGS.filter(s => s.genre === predictedGenre);
  const recommendations = genreSongs.map(song => ({
    ...song,
    similarity: 0.7 + Math.random() * 0.25, // 70-95% similarity
  })).sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  
  return {
    prediction: {
      genre: predictedGenre,
      confidence: mainProb,
      probabilities,
    },
    recommendations,
  };
}
