import { motion } from 'framer-motion';
import { AudioWaveform } from './AudioWaveform';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Analyzing audio...' }: LoadingStateProps) {
  const steps = [
    'Extracting audio features...',
    'Computing MFCCs and spectral data...',
    'Running genre classification...',
    'Finding similar songs...',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-8 text-center"
    >
      <div className="mb-8">
        <AudioWaveform isAnimating barCount={24} />
      </div>

      <motion.h3
        key={message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold gradient-text mb-4"
      >
        {message}
      </motion.h3>

      <div className="space-y-2 max-w-xs mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.5 }}
            className="flex items-center gap-3 text-sm text-muted-foreground"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.5 + 0.2 }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <span>{step}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 h-1 bg-muted rounded-full overflow-hidden max-w-xs mx-auto"
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
        />
      </motion.div>
    </motion.div>
  );
}
