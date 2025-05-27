import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Video, Play, Edit, Trash2, Download, Save, Plus } from "lucide-react";
import type { Video as VideoType, MediaFile } from "@shared/schema";

export default function VideoManager() {
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const { toast } = useToast();

  const { data: videos, isLoading } = useQuery<VideoType[]>({
    queryKey: ["/api/videos"],
  });

  const { data: mediaFiles } = useQuery<MediaFile[]>({
    queryKey: ["/api/media"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/videos', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setIsCreateMode(false);
      toast({
        title: "Success",
        description: "Video created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create video",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PUT', `/api/videos/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setEditingVideo(null);
      toast({
        title: "Success",
        description: "Video updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update video",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "Success",
        description: "Video deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
    },
  });

  const getMediaFile = (mediaFileId: number | null) => {
    if (!mediaFileId) return null;
    return mediaFiles?.find(file => file.id === mediaFileId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-white/10 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Video Management</h2>
        <Button 
          onClick={() => setIsCreateMode(true)}
          className="gradient-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </div>

      {/* Videos List */}
      <div className="space-y-6">
        {videos?.map((video) => {
          const mediaFile = getMediaFile(video.mediaFileId);
          const thumbnailFile = getMediaFile(video.thumbnailId);
          
          return (
            <Card key={video.id} className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                      {thumbnailFile ? (
                        <img 
                          src={thumbnailFile.url} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : mediaFile ? (
                        <video
                          src={mediaFile.url}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button 
                          size="lg"
                          variant="secondary"
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                          onClick={() => {
                            if (mediaFile) {
                              window.open(mediaFile.url, '_blank');
                            }
                          }}
                        >
                          <Play className="w-6 h-6" />
                        </Button>
                      </div>
                      
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                          {formatDuration(video.duration)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                        {video.description && (
                          <p className="text-gray-400">{video.description}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-400">Category:</span>
                          <p className="text-white capitalize">{video.category || "Unknown"}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Visibility:</span>
                          <p className="text-white capitalize">{video.visibility}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          {mediaFile && (
                            <>
                              <span>Size: {formatFileSize(mediaFile.size)}</span>
                              {video.duration && <span> • Duration: {formatDuration(video.duration)}</span>}
                              <span> • Format: {mediaFile.mimeType?.split('/')[1]?.toUpperCase()}</span>
                            </>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {mediaFile && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-effect border-white/20 text-white"
                              onClick={() => window.open(mediaFile.url, '_blank')}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-effect border-white/20 text-white"
                            onClick={() => setEditingVideo(video)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMutation.mutate(video.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {videos?.length === 0 && (
          <Card className="glass-effect border-white/10">
            <CardContent className="p-12 text-center">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
              <p className="text-gray-400">Upload your first video to get started</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateMode || !!editingVideo} onOpenChange={() => {
        setIsCreateMode(false);
        setEditingVideo(null);
      }}>
        <DialogContent className="glass-effect border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isCreateMode ? "Add Video" : "Edit Video"}
            </DialogTitle>
          </DialogHeader>
          
          <VideoForm
            video={editingVideo}
            mediaFiles={mediaFiles || []}
            onSave={(data) => {
              if (isCreateMode) {
                createMutation.mutate(data);
              } else if (editingVideo) {
                updateMutation.mutate({ id: editingVideo.id, data });
              }
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface VideoFormProps {
  video: VideoType | null;
  mediaFiles: MediaFile[];
  onSave: (data: any) => void;
  isLoading: boolean;
}

function VideoForm({ video, mediaFiles, onSave, isLoading }: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: video?.title || "",
    description: video?.description || "",
    category: video?.category || "reel",
    mediaFileId: video?.mediaFileId || null,
    thumbnailId: video?.thumbnailId || null,
    visibility: video?.visibility || "public",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const videoFiles = mediaFiles.filter(file => file.mimeType?.startsWith('video/'));
  const imageFiles = mediaFiles.filter(file => file.mimeType?.startsWith('image/'));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="glass-effect border-white/20 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="glass-effect border-white/20 text-white"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <Select value={formData.category || "reel"} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className="glass-effect border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reel">Demo Reel</SelectItem>
              <SelectItem value="behind">Behind the Scenes</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Visibility</label>
          <Select value={formData.visibility || "public"} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
            <SelectTrigger className="glass-effect border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Video File</label>
        <Select 
          value={formData.mediaFileId?.toString() || ""} 
          onValueChange={(value) => setFormData({ ...formData, mediaFileId: value ? parseInt(value) : null })}
        >
          <SelectTrigger className="glass-effect border-white/20 text-white">
            <SelectValue placeholder="Select a video file" />
          </SelectTrigger>
          <SelectContent>
            {videoFiles.map(file => (
              <SelectItem key={file.id} value={file.id.toString()}>
                {file.originalName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Thumbnail (Optional)</label>
        <Select 
          value={formData.thumbnailId?.toString() || ""} 
          onValueChange={(value) => setFormData({ ...formData, thumbnailId: value ? parseInt(value) : null })}
        >
          <SelectTrigger className="glass-effect border-white/20 text-white">
            <SelectValue placeholder="Select a thumbnail image" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No thumbnail</SelectItem>
            {imageFiles.map(file => (
              <SelectItem key={file.id} value={file.id.toString()}>
                {file.originalName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-3">
        <Button type="submit" disabled={isLoading} className="gradient-primary">
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
