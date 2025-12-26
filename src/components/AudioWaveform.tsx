import { motion } from 'framer-motion';

interface AudioWaveformProps {
  isAnimating?: boolean;
  barCount?: number;
  className?: string;
}

export function AudioWaveform({ isAnimating = false, barCount = 20, className = '' }: AudioWaveformProps) {
  return (
    <div className={`flex items-end justify-center gap-1 h-16 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-primary to-secondary"
          initial={{ height: 8 }}
          animate={isAnimating ? {
            height: [8, 20 + Math.random() * 44, 8],
          } : { height: 8 + Math.sin(i * 0.5) * 8 }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: isAnimating ? Infinity : 0,
            repeatType: 'reverse',
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
