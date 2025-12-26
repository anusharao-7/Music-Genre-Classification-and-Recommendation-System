import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SAMPLE_AUDIO_FILES } from '@/lib/mockData';
import { GENRE_LABELS, Genre } from '@/types/music';

interface SampleSelectorProps {
  selectedSample: string | null;
  onSampleSelect: (sampleId: string | null) => void;
  disabled?: boolean;
}

export function SampleSelector({ selectedSample, onSampleSelect, disabled }: SampleSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        Or select a sample audio file
      </label>
      <Select
        value={selectedSample || ''}
        onValueChange={(value) => onSampleSelect(value || null)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full glass-card border-border/50 h-12">
          <div className="flex items-center gap-3">
            <Music2 className="w-4 h-4 text-primary" />
            <SelectValue placeholder="Choose a sample audio file..." />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {SAMPLE_AUDIO_FILES.map((sample, index) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SelectItem value={sample.id} className="cursor-pointer">
                <div className="flex items-center gap-3 py-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(var(--genre-${sample.genre}))` 
                    }}
                  />
                  <span>{sample.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({GENRE_LABELS[sample.genre as Genre]})
                  </span>
                </div>
              </SelectItem>
            </motion.div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
