import { useState } from 'react';
import { VideoUpload } from '@/components/VideoUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  const handleVideoSelect = (file: File) => {
    setSelectedVideo(file);
    setAnalysis(null);
  };

  const extractFramesFromVideo = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const frames: string[] = [];
        const frameTimes = [0.2, 0.4, 0.6]; // Extract 3 frames at 20%, 40%, 60% of video
        
        let frameIndex = 0;
        
        const captureFrame = () => {
          if (frameIndex >= frameTimes.length) {
            URL.revokeObjectURL(video.src);
            resolve(frames);
            return;
          }
          
          video.currentTime = video.duration * frameTimes[frameIndex];
        };
        
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          frames.push(canvas.toDataURL('image/jpeg', 0.8));
          frameIndex++;
          captureFrame();
        };
        
        video.onerror = () => reject(new Error('Failed to load video'));
        captureFrame();
      };
    });
  };

  const handleAnalyze = async () => {
    if (!selectedVideo) return;

    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Extracting frames...",
        description: "Preparing video for analysis",
      });

      // Extract frames from video
      const frames = await extractFramesFromVideo(selectedVideo);

      toast({
        title: "Analyzing performance...",
        description: "AI is reviewing your technique",
      });

      // Call backend function with frames
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-video`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ frames }),
        }
      );

      if (!response.ok) {
        const status = response.status;
        let message = 'Failed to analyze video';
        let raw = await response.text().catch(() => '');
        try {
          const parsed = JSON.parse(raw);
          message = parsed.error || message;
        } catch {}
        throw new Error(message);
      }

      const data = await response.json();
      setAnalysis(data.analysis);

      toast({
        title: "Analysis Complete!",
        description: "AI has analyzed your performance",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">AI-Powered Sport Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            SportLens AI
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Upload your sport videos and get instant AI-powered coaching suggestions to improve your performance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Video Upload Section */}
          <VideoUpload onVideoSelect={handleVideoSelect} />

          {/* Analyze Button */}
          {selectedVideo && !analysis && (
            <div className="flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                size="lg"
                className="bg-gradient-primary shadow-primary hover:shadow-xl transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Video
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && <AnalysisResults analysis={analysis} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
