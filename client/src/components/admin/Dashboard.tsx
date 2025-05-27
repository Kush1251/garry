import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Images, Video, HardDrive, Clock, Upload, Edit, Grid } from "lucide-react";

interface DashboardProps {
  onSectionChange: (section: "media" | "content" | "gallery") => void;
}

export default function Dashboard({ onSectionChange }: DashboardProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const formatStorage = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Never";
    const now = new Date();
    const updateDate = new Date(date);
    const diffMs = now.getTime() - updateDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return updateDate.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-effect border-white/10 animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-white/10 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Images</p>
                <p className="text-2xl font-bold text-primary">
                  {stats?.totalImages || 0}
                </p>
              </div>
              <Images className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Videos</p>
                <p className="text-2xl font-bold text-primary">
                  {stats?.totalVideos || 0}
                </p>
              </div>
              <Video className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-primary">
                  {formatStorage(stats?.storageUsed || 0)}
                </p>
              </div>
              <HardDrive className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Last Update</p>
                <p className="text-2xl font-bold text-primary">
                  {formatDate(stats?.lastUpdate)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-effect border-white/10">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">System initialized</p>
                <p className="text-sm text-gray-400">Ready to upload and manage content</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          variant="outline"
          className="glass-effect border-white/20 h-auto p-6 flex flex-col items-start space-y-3 hover:bg-white/10 transition-colors"
          onClick={() => onSectionChange("media")}
        >
          <Upload className="w-8 h-8 text-primary" />
          <div className="text-left">
            <h4 className="font-bold text-white">Upload Media</h4>
            <p className="text-gray-400 text-sm">Add new images or videos to your portfolio</p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="glass-effect border-white/20 h-auto p-6 flex flex-col items-start space-y-3 hover:bg-white/10 transition-colors"
          onClick={() => onSectionChange("content")}
        >
          <Edit className="w-8 h-8 text-primary" />
          <div className="text-left">
            <h4 className="font-bold text-white">Edit Content</h4>
            <p className="text-gray-400 text-sm">Update your bio, skills, and other content</p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="glass-effect border-white/20 h-auto p-6 flex flex-col items-start space-y-3 hover:bg-white/10 transition-colors"
          onClick={() => onSectionChange("gallery")}
        >
          <Grid className="w-8 h-8 text-primary" />
          <div className="text-left">
            <h4 className="font-bold text-white">Manage Gallery</h4>
            <p className="text-gray-400 text-sm">Organize and curate your portfolio gallery</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
