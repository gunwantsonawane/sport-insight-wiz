import { useState, useRef } from 'react';
import { Upload, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
}

export const VideoUpload = ({ onVideoSelect }: VideoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 100MB for web)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a video smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onVideoSelect(file);
  };

  const handleClear = () => {
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6 border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
        id="video-upload"
      />
      
      {!preview ? (
        <label
          htmlFor="video-upload"
          className="flex flex-col items-center justify-center cursor-pointer py-12"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-4 shadow-primary">
            <Upload className="w-10 h-10 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload Your Sport Video</h3>
          <p className="text-muted-foreground text-center">
            Click to select or drag and drop your video here
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Supports MP4, MOV, AVI • Max 100MB
          </p>
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-muted">
            <video
              src={preview}
              controls
              className="w-full max-h-96 object-contain"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{fileName}</p>
                <p className="text-xs text-muted-foreground">Ready to analyze</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
