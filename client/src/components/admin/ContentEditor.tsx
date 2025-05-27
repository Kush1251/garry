import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import type { ContentSection, MediaFile } from "@shared/schema";

export default function ContentEditor() {
  const [activeTab, setActiveTab] = useState("about");
  const { toast } = useToast();

  const { data: contentSections } = useQuery<ContentSection[]>({
    queryKey: ["/api/content"],
  });

  const { data: mediaFiles } = useQuery<MediaFile[]>({
    queryKey: ["/api/media"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, data }: { key: string; data: any }) => {
      const response = await apiRequest('PUT', `/api/content/${key}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    },
  });

  const getContentSection = (key: string) => {
    return contentSections?.find(section => section.key === key);
  };

  const handleSave = (key: string, data: any) => {
    updateMutation.mutate({ key, data });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Content Editor</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-effect">
          <TabsTrigger value="about" className="data-[state=active]:bg-primary">About Section</TabsTrigger>
          <TabsTrigger value="hero" className="data-[state=active]:bg-primary">Hero Section</TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-primary">Skills</TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-primary">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <AboutEditor 
            section={getContentSection("about")}
            mediaFiles={mediaFiles || []}
            onSave={(data) => handleSave("about", data)}
            isLoading={updateMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="hero">
          <HeroEditor 
            section={getContentSection("hero")}
            mediaFiles={mediaFiles || []}
            onSave={(data) => handleSave("hero", data)}
            isLoading={updateMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsEditor />
        </TabsContent>

        <TabsContent value="contact">
          <ContactEditor 
            section={getContentSection("contact")}
            onSave={(data) => handleSave("contact", data)}
            isLoading={updateMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SectionEditorProps {
  section?: ContentSection;
  mediaFiles?: MediaFile[];
  onSave: (data: any) => void;
  isLoading: boolean;
}

function AboutEditor({ section, mediaFiles, onSave, isLoading }: SectionEditorProps) {
  const [formData, setFormData] = useState({
    title: section?.title || "About Me",
    content: section?.content || "",
    profileImageUrl: (section?.metadata as any)?.profileImageUrl || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      content: formData.content,
      metadata: {
        profileImageUrl: formData.profileImageUrl,
      },
    });
  };

  return (
    <Card className="glass-effect border-white/10">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="about-title" className="text-white">Section Title</Label>
            <Input
              id="about-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="glass-effect border-white/20 text-white"
            />
          </div>

          <div>
            <Label htmlFor="about-content" className="text-white">About Text</Label>
            <Textarea
              id="about-content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="glass-effect border-white/20 text-white min-h-32"
              placeholder="Write about your experience and background..."
            />
          </div>

          <div>
            <Label htmlFor="profile-image" className="text-white">Profile Image</Label>
            <Select 
              value={formData.profileImageUrl} 
              onValueChange={(value) => setFormData({ ...formData, profileImageUrl: value })}
            >
              <SelectTrigger className="glass-effect border-white/20 text-white">
                <SelectValue placeholder="Select an uploaded image" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No image</SelectItem>
                {mediaFiles?.filter(file => file.mimeType?.startsWith('image/')).map(file => (
                  <SelectItem key={file.id} value={file.url}>
                    {file.originalName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="gradient-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function HeroEditor({ section, mediaFiles, onSave, isLoading }: SectionEditorProps) {
  const [formData, setFormData] = useState({
    title: section?.title || "Hero Section",
    headline: (section?.metadata as any)?.headline || "GARRY BELL",
    subtitle: (section?.metadata as any)?.subtitle || "Fighter & Stunt Performer",
    backgroundImageUrl: (section?.metadata as any)?.backgroundImageUrl || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      metadata: {
        headline: formData.headline,
        subtitle: formData.subtitle,
        backgroundImageUrl: formData.backgroundImageUrl,
      },
    });
  };

  return (
    <Card className="glass-effect border-white/10">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="hero-headline" className="text-white">Main Headline</Label>
            <Input
              id="hero-headline"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="glass-effect border-white/20 text-white text-2xl font-bold"
            />
          </div>

          <div>
            <Label htmlFor="hero-subtitle" className="text-white">Subtitle</Label>
            <Input
              id="hero-subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="glass-effect border-white/20 text-white"
            />
          </div>

          <div>
            <Label htmlFor="background-image" className="text-white">Background Image</Label>
            <Select 
              value={formData.backgroundImageUrl} 
              onValueChange={(value) => setFormData({ ...formData, backgroundImageUrl: value === "none" ? "" : value })}
            >
              <SelectTrigger className="glass-effect border-white/20 text-white">
                <SelectValue placeholder="Select a background image" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No background image</SelectItem>
                {mediaFiles?.filter(file => file.mimeType?.startsWith('image/')).map(file => (
                  <SelectItem key={file.id} value={file.url}>
                    {file.originalName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="gradient-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SkillsEditor() {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["/api/skills"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/skills', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      setIsCreateMode(false);
      toast({
        title: "Success",
        description: "Skill created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create skill",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PUT', `/api/skills/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      setEditingSkill(null);
      toast({
        title: "Success",
        description: "Skill updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/skills/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="glass-effect border-white/10">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Skills Management</h3>
          <Button 
            onClick={() => setIsCreateMode(true)}
            className="gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-white">Loading skills...</div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 mb-4">No skills added yet</p>
            <Button 
              onClick={() => setIsCreateMode(true)}
              className="gradient-primary"
            >
              Add Your First Skill
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {skills.map((skill: any) => (
              <div key={skill.id} className="glass-effect border border-white/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
                    {skill.description && (
                      <p className="text-gray-400 text-sm mt-1">{skill.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingSkill(skill)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(skill.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-red-400 font-medium">Level {skill.level}/10</span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(skill.level / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        <Dialog open={isCreateMode || !!editingSkill} onOpenChange={() => {
          setIsCreateMode(false);
          setEditingSkill(null);
        }}>
          <DialogContent className="glass-effect border-white/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">
                {isCreateMode ? "Add New Skill" : "Edit Skill"}
              </DialogTitle>
            </DialogHeader>
            
            <SkillForm
              skill={editingSkill}
              onSave={(data) => {
                if (isCreateMode) {
                  createMutation.mutate(data);
                } else if (editingSkill) {
                  updateMutation.mutate({ id: editingSkill.id, data });
                }
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function SkillForm({ skill, onSave, isLoading }: { 
  skill: any; 
  onSave: (data: any) => void; 
  isLoading: boolean; 
}) {
  const [formData, setFormData] = useState({
    name: skill?.name || "",
    description: skill?.description || "",
    level: skill?.level || 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-white">Skill Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="glass-effect border-white/20 text-white"
          placeholder="e.g., Boxing, Stunt Driving, Sword Fighting"
          required
        />
      </div>

      <div>
        <Label className="text-white">Description (Optional)</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="glass-effect border-white/20 text-white"
          placeholder="Brief description of your experience..."
          rows={3}
        />
      </div>

      <div>
        <Label className="text-white">Skill Level: {formData.level}/10</Label>
        <div className="mt-2">
          <input
            type="range"
            min="1"
            max="10"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f97316 ${(formData.level / 10) * 100}%, #374151 ${(formData.level / 10) * 100}%, #374151 100%)`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Beginner</span>
          <span>Expert</span>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" disabled={isLoading} className="gradient-primary flex-1">
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Skill"}
        </Button>
      </div>
    </form>
  );
}

function ContactEditor({ section, onSave, isLoading }: SectionEditorProps) {
  const [formData, setFormData] = useState({
    title: section?.title || "Contact Information",
    email: (section?.metadata as any)?.email || "",
    phone: (section?.metadata as any)?.phone || "",
    location: (section?.metadata as any)?.location || "",
    website: (section?.metadata as any)?.website || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      metadata: {
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        website: formData.website,
      },
    });
  };

  return (
    <Card className="glass-effect border-white/10">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contact-email" className="text-white">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass-effect border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="contact-phone" className="text-white">Phone</Label>
              <Input
                id="contact-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="glass-effect border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="contact-location" className="text-white">Location</Label>
              <Input
                id="contact-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="glass-effect border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="contact-website" className="text-white">Website</Label>
              <Input
                id="contact-website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="glass-effect border-white/20 text-white"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="gradient-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
