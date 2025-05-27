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
import { Plus, Eye, Edit, Trash2, Save, X } from "lucide-react";
import type { PortfolioItem, MediaFile } from "@shared/schema";

export default function Gallery() {
  const [filter, setFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const { toast } = useToast();

  const { data: portfolioItems, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  const { data: mediaFiles } = useQuery<MediaFile[]>({
    queryKey: ["/api/media"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/portfolio', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsCreateMode(false);
      toast({
        title: "Success",
        description: "Portfolio item created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create portfolio item",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PUT', `/api/portfolio/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setEditingItem(null);
      toast({
        title: "Success",
        description: "Portfolio item updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update portfolio item",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/portfolio/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      });
    },
  });

  const filteredItems = portfolioItems?.filter(item => {
    if (filter === "all") return true;
    return item.category === filter;
  }) || [];

  const getMediaFile = (mediaFileId: number | null) => {
    if (!mediaFileId) return null;
    return mediaFiles?.find(file => file.id === mediaFileId);
  };

  const getCategoryBadgeColor = (category: string | null) => {
    switch (category) {
      case "action": return "bg-primary";
      case "fights": return "bg-green-500";
      case "stunts": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-white/10 rounded-xl"></div>
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
        <h2 className="text-2xl font-bold text-white">Portfolio Gallery</h2>
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 glass-effect border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="action">Action Scenes</SelectItem>
              <SelectItem value="fights">Fight Sequences</SelectItem>
              <SelectItem value="stunts">Stunt Work</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setIsCreateMode(true)}
            className="gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Gallery
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const firstImageId = item.mediaFileIds?.[0];
          const mediaFile = firstImageId ? getMediaFile(firstImageId) : null;
          
          return (
            <Card key={item.id} className="glass-effect border-white/10 group overflow-hidden">
              <div className="aspect-video relative">
                {mediaFile ? (
                  <img
                    src={mediaFile.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-400">No image</p>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 border-0"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {item.category && (
                  <div className="absolute top-4 left-4">
                    <span className={`${getCategoryBadgeColor(item.category)} px-2 py-1 rounded text-xs text-white capitalize`}>
                      {item.category}
                    </span>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium text-lg text-white mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateMode || !!editingItem} onOpenChange={() => {
        setIsCreateMode(false);
        setEditingItem(null);
      }}>
        <DialogContent className="glass-effect border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isCreateMode ? "Add Portfolio Item" : "Edit Portfolio Item"}
            </DialogTitle>
          </DialogHeader>
          
          <PortfolioItemForm
            item={editingItem}
            mediaFiles={mediaFiles || []}
            onSave={(data) => {
              if (isCreateMode) {
                createMutation.mutate(data);
              } else if (editingItem) {
                updateMutation.mutate({ id: editingItem.id, data });
              }
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PortfolioItemFormProps {
  item: PortfolioItem | null;
  mediaFiles: MediaFile[];
  onSave: (data: any) => void;
  isLoading: boolean;
}

function PortfolioItemForm({ item, mediaFiles, onSave, isLoading }: PortfolioItemFormProps) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    category: item?.category || "action",
    mediaFileIds: item?.mediaFileIds || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

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

      <div>
        <label className="block text-sm font-medium text-white mb-2">Category</label>
        <Select value={formData.category || "action"} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className="glass-effect border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="action">Action Scenes</SelectItem>
            <SelectItem value="fights">Fight Sequences</SelectItem>
            <SelectItem value="stunts">Stunt Work</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-4">Project Gallery (Select Multiple Images)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-4 glass-effect border border-white/20 rounded-lg">
          {imageFiles.map(file => (
            <div key={file.id} className="relative">
              <div 
                className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  formData.mediaFileIds.includes(file.id) 
                    ? 'border-red-500 ring-2 ring-red-500/50' 
                    : 'border-white/20 hover:border-white/40'
                }`}
                onClick={() => {
                  const newSelected = formData.mediaFileIds.includes(file.id)
                    ? formData.mediaFileIds.filter(id => id !== file.id)
                    : [...formData.mediaFileIds, file.id];
                  setFormData({ ...formData, mediaFileIds: newSelected });
                }}
              >
                <img 
                  src={file.url} 
                  alt={file.originalName}
                  className="w-full h-full object-cover"
                />
                {formData.mediaFileIds.includes(file.id) && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {formData.mediaFileIds.indexOf(file.id) + 1}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1 truncate">{file.originalName}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Selected: {formData.selectedImages.length} images. Click images to add/remove from gallery.
        </p>
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
