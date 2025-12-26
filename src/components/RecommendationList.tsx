import { motion } from 'framer-motion';
import { Disc3, Clock, Sparkles } from 'lucide-react';
import { Song, GENRE_LABELS } from '@/types/music';

interface RecommendationListProps {
  recommendations: Song[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  if (recommendations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Similar Songs</h3>
          <p className="text-sm text-muted-foreground">Based on audio features</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `hsl(var(--genre-${song.genre}) / 0.15)` }}
            >
              <Disc3 
                className="w-6 h-6 group-hover:animate-spin"
                style={{ 
                  color: `hsl(var(--genre-${song.genre}))`,
                  animationDuration: '3s'
                }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate group-hover:text-primary transition-colors">
                {song.title}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {song.artist}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {song.similarity && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Similarity</p>
                  <p 
                    className="text-sm font-semibold"
                    style={{ color: `hsl(var(--genre-${song.genre}))` }}
                  >
                    {Math.round(song.similarity * 100)}%
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{song.duration}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
