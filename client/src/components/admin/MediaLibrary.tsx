import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, Eye, Edit, Trash2, CloudUpload, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaFile } from "@shared/schema";

export default function MediaLibrary() {
  const [filter, setFilter] = useState("all");
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
  const { toast } = useToast();

  const { data: mediaFiles, isLoading } = useQuery<MediaFile[]>({
    queryKey: ["/api/media"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // Use fetch directly for file uploads to avoid JSON headers
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include session cookies
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      uploadMutation.mutate(file);
    });
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'video/*': ['.mp4', '.webm'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const filteredFiles = mediaFiles?.filter(file => {
    if (filter === "all") return true;
    if (filter === "images") return file.mimeType?.startsWith('image/');
    if (filter === "videos") return file.mimeType?.startsWith('video/');
    return true;
  }) || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-white/10 rounded-xl mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Media Library</h2>
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 glass-effect border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Media</SelectItem>
              <SelectItem value="images">Images Only</SelectItem>
              <SelectItem value="videos">Videos Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upload Zone */}
      <Card className={cn(
        "glass-effect border-2 border-dashed border-white/20 transition-all",
        isDragActive && "border-primary bg-primary/10"
      )}>
        <CardContent {...getRootProps()} className="p-12 text-center cursor-pointer">
          <input {...getInputProps()} />
          <CloudUpload className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {isDragActive ? "Drop files here" : "Drag & Drop Files Here"}
          </h3>
          <p className="text-gray-400 mb-4">or click to browse files</p>
          <Button variant="outline" className="glass-effect border-white/20 text-white">
            Choose Files
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Supports: JPG, PNG, WebP, MP4, WebM (Max: 50MB)
          </p>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="glass-effect border-white/10 group overflow-hidden">
            <div className="aspect-square relative">
              {file.mimeType?.startsWith('image/') ? (
                <img
                  src={file.url}
                  alt={file.originalName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center relative">
                  <Play className="w-8 h-8 text-white" />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    MP4
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 border-0"
                    onClick={() => setPreviewMedia(file)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(file.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <CardContent className="p-3">
              <p className="text-sm font-medium text-white truncate">
                {file.originalName}
              </p>
              <p className="text-xs text-gray-400">
                {formatFileSize(file.size)} • {formatDate(file.createdAt!)}
              </p>
            </CardContent>
          </Card>
        ))}

        {/* Add Media Button */}
        <Card className="glass-effect border-2 border-dashed border-white/20 aspect-square flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
          <div className="text-center" {...getRootProps()}>
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-gray-400">Add Media</p>
          </div>
        </Card>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewMedia} onOpenChange={() => setPreviewMedia(null)}>
        <DialogContent className="max-w-4xl glass-effect border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Media Preview</DialogTitle>
          </DialogHeader>
          
          {previewMedia && (
            <div className="space-y-4">
              {previewMedia.mimeType?.startsWith('image/') ? (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.originalName}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <video
                  src={previewMedia.url}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              )}
              
              <div>
                <h4 className="font-bold text-white mb-2">{previewMedia.originalName}</h4>
                <p className="text-gray-400 text-sm">
                  Size: {formatFileSize(previewMedia.size)} • 
                  Type: {previewMedia.mimeType} • 
                  Uploaded: {formatDate(previewMedia.createdAt!)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
