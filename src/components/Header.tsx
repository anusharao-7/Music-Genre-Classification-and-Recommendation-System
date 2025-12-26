import { motion } from 'framer-motion';
import { AudioWaveform } from './AudioWaveform';
import { Music2, Github, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
            >
              <Music2 className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">GenreAI</h1>
              <p className="text-xs text-muted-foreground">Music Classification</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
            <Button variant="ghost" size="sm">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </Button>
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">Music Genre</span>
              <br />
              Classification & Discovery
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Upload an audio file and let AI analyze its genre using advanced 
              feature extraction and deep learning. Get personalized song recommendations 
              based on audio similarity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <AudioWaveform barCount={32} className="opacity-40" />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
