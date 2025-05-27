import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Download, Upload, Shield } from "lucide-react";

export default function Settings() {
  const [siteSettings, setSiteSettings] = useState({
    title: "Garry Bell - Fighter & Stunt Performer",
    description: "Professional Fighter and Stunt Performer specializing in authentic combat choreography and high-impact stunts.",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const { toast } = useToast();

  const handleSiteSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the site settings
    toast({
      title: "Success",
      description: "Site settings saved successfully",
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Here you would handle password change
    toast({
      title: "Success",
      description: "Password updated successfully",
    });
    
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handleBackup = () => {
    // Here you would trigger a backup download
    toast({
      title: "Info",
      description: "Backup download started",
    });
  };

  const handleRestore = () => {
    // Here you would handle backup restore
    toast({
      title: "Info",
      description: "Restore functionality will be available soon",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      {/* Site Settings */}
      <Card className="glass-effect border-white/10">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Site Settings</h3>
          <form onSubmit={handleSiteSettingsSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="site-title" className="text-white">Site Title</Label>
                <Input
                  id="site-title"
                  value={siteSettings.title}
                  onChange={(e) => setSiteSettings({ ...siteSettings, title: e.target.value })}
                  className="glass-effect border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="meta-description" className="text-white">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={siteSettings.description}
                  onChange={(e) => setSiteSettings({ ...siteSettings, description: e.target.value })}
                  className="glass-effect border-white/20 text-white"
                  rows={3}
                />
              </div>
            </div>
            <Button type="submit" className="gradient-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Site Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="glass-effect border-white/10">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            <Shield className="w-5 h-5 inline mr-2" />
            Security
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="current-password" className="text-white">Change Password</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="glass-effect border-white/20 text-white"
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="glass-effect border-white/20 text-white"
                />
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="glass-effect border-white/20 text-white"
                />
              </div>
            </div>
            <Button type="submit" className="gradient-primary">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Backup & Export */}
      <Card className="glass-effect border-white/10">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Backup & Export</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleBackup}
              className="glass-effect border-white/20 text-white h-auto p-6 flex flex-col items-center space-y-3 hover:bg-white/10"
            >
              <Download className="w-8 h-8 text-primary" />
              <div className="text-center">
                <p className="font-medium">Download Backup</p>
                <p className="text-sm text-gray-400">Export all content and media</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleRestore}
              className="glass-effect border-white/20 text-white h-auto p-6 flex flex-col items-center space-y-3 hover:bg-white/10"
            >
              <Upload className="w-8 h-8 text-primary" />
              <div className="text-center">
                <p className="font-medium">Restore Backup</p>
                <p className="text-sm text-gray-400">Import previous backup</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="glass-effect border-white/10">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-400">Version</p>
              <p className="text-white font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Last Backup</p>
              <p className="text-white font-medium">Never</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Environment</p>
              <p className="text-white font-medium">Production</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
