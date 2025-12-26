import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-6 border-destructive/50"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-destructive mb-1">Something went wrong</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
          
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
