import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface AnalysisData {
  sport: string;
  confidence: number;
  technique_analysis: string[];
  improvement_suggestions: string[];
  positive_highlights: string[];
  areas_of_concern: string[];
}

interface AnalysisResultsProps {
  analysis: AnalysisData;
}

export const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  const confidencePercentage = Math.round(analysis.confidence * 100);
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Sport & Confidence Header */}
      <Card className="p-6 bg-gradient-primary shadow-primary">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-primary-foreground">
            Sport Detected: {analysis.sport}
          </h3>
          <Badge variant="secondary" className="text-sm">
            {confidencePercentage}% Confidence
          </Badge>
        </div>
      </Card>

      {/* Technique Analysis */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Technique Analysis</h3>
        </div>
        <div className="space-y-3">
          {analysis.technique_analysis.map((point, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Badge variant="secondary" className="mt-1">
                {index + 1}
              </Badge>
              <p className="flex-1 text-sm">{point}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Positive Highlights */}
      <Card className="p-6 border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Positive Highlights</h3>
        </div>
        <div className="space-y-3">
          {analysis.positive_highlights.map((highlight, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-primary/20"
            >
              <p className="text-sm font-medium">{highlight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Improvement Suggestions */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-bold">Improvement Suggestions</h3>
        </div>
        <div className="space-y-3">
          {analysis.improvement_suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Badge variant="outline" className="mt-1">
                {index + 1}
              </Badge>
              <p className="flex-1 text-sm">{suggestion}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Areas of Concern */}
      <Card className="p-6 border-2 border-destructive/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="text-xl font-bold">Areas of Concern</h3>
        </div>
        <div className="space-y-3">
          {analysis.areas_of_concern.map((concern, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gradient-to-r from-destructive/5 to-transparent border border-destructive/20"
            >
              <p className="text-sm font-medium">{concern}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
