import { motion } from 'framer-motion';
import { Music, TrendingUp } from 'lucide-react';
import { PredictionResult, GENRE_LABELS, Genre } from '@/types/music';

interface GenreCardProps {
  prediction: PredictionResult;
}

export function GenreCard({ prediction }: GenreCardProps) {
  const confidencePercent = Math.round(prediction.confidence * 100);
  
  // Get top 5 genres by probability
  const topGenres = Object.entries(prediction.probabilities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 overflow-hidden relative"
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at top left, hsl(var(--genre-${prediction.genre})) 0%, transparent 60%)`
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `hsl(var(--genre-${prediction.genre}) / 0.2)` }}
          >
            <Music 
              className="w-8 h-8" 
              style={{ color: `hsl(var(--genre-${prediction.genre}))` }}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Predicted Genre</p>
            <h3 
              className="text-3xl font-bold"
              style={{ color: `hsl(var(--genre-${prediction.genre}))` }}
            >
              {GENRE_LABELS[prediction.genre]}
            </h3>
          </div>
        </div>

        {/* Confidence meter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Confidence
            </span>
            <span className="text-lg font-semibold text-foreground">
              {confidencePercent}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercent}%` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, hsl(var(--genre-${prediction.genre})), hsl(var(--primary)))` 
              }}
            />
          </div>
        </div>

        {/* Probability distribution */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Genre Probabilities</p>
          {topGenres.map(([genre, prob], index) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div 
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: `hsl(var(--genre-${genre}))` }}
              />
              <span className="text-sm min-w-[80px]">{GENRE_LABELS[genre as Genre]}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${prob * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: `hsl(var(--genre-${genre}))` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-12 text-right">
                {Math.round(prob * 100)}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
