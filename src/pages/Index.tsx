import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, RotateCcw, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { SampleSelector } from '@/components/SampleSelector';
import { GenreCard } from '@/components/GenreCard';
import { RecommendationList } from '@/components/RecommendationList';
import { LoadingState } from '@/components/LoadingState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { predictGenre } from '@/lib/api';
import { RecommendationResult } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setSelectedSample(null);
      setResult(null);
      setError(null);
    }
  };

  const handleSampleSelect = (sampleId: string | null) => {
    setSelectedSample(sampleId);
    if (sampleId) {
      setSelectedFile(null);
      setResult(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile && !selectedSample) {
      toast({
        title: 'No input selected',
        description: 'Please upload an audio file or select a sample.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await predictGenre(selectedFile, selectedSample || undefined);
      setResult(prediction);
      toast({
        title: 'Analysis complete!',
        description: `Detected genre: ${prediction.prediction.genre}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze audio';
      setError(message);
      toast({
        title: 'Analysis failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedSample(null);
    setResult(null);
    setError(null);
  };

  const hasInput = selectedFile || selectedSample;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 sm:p-8"
          >
            <div className="space-y-6">
              <FileUpload
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                disabled={isLoading}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-4 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <SampleSelector
                selectedSample={selectedSample}
                onSampleSelect={handleSampleSelect}
                disabled={isLoading}
              />

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handlePredict}
                  disabled={!hasInput || isLoading}
                  className="flex-1"
                >
                  <Wand2 className="w-5 h-5" />
                  Predict Genre
                </Button>

                {hasInput && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleReset}
                      disabled={isLoading}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingState />
              </motion.div>
            )}

            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorMessage message={error} onRetry={handlePredict} />
              </motion.div>
            )}

            {result && !isLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <GenreCard prediction={result.prediction} />
                <RecommendationList recommendations={result.recommendations} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features Section */}
          {!result && !isLoading && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: '🎵',
                  title: 'Audio Analysis',
                  description: 'Extracts MFCCs, chroma, and spectral features from your audio'
                },
                {
                  icon: '🧠',
                  title: 'Deep Learning',
                  description: 'Uses a trained neural network for accurate genre classification'
                },
                {
                  icon: '🎧',
                  title: 'Smart Recommendations',
                  description: 'Suggests similar songs using cosine similarity matching'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="glass-card p-6 text-center"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16">
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Music Genre Classification & Recommendation System</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with React, FastAPI & Machine Learning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
