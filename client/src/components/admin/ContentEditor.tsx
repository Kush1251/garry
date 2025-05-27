import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import type { ContentSection } from "@shared/schema";

export default function ContentEditor() {
  const [activeTab, setActiveTab] = useState("about");
  const { toast } = useToast();

  const { data: contentSections } = useQuery<ContentSection[]>({
    queryKey: ["/api/content"],
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
            onSave={(data) => handleSave("about", data)}
            isLoading={updateMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="hero">
          <HeroEditor 
            section={getContentSection("hero")}
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
  onSave: (data: any) => void;
  isLoading: boolean;
}

function AboutEditor({ section, onSave, isLoading }: SectionEditorProps) {
  const [formData, setFormData] = useState({
    title: section?.title || "About Me",
    content: section?.content || "",
    profileImageUrl: section?.metadata?.profileImageUrl || "",
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
            <Label htmlFor="profile-image" className="text-white">Profile Image URL</Label>
            <Input
              id="profile-image"
              value={formData.profileImageUrl}
              onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
              className="glass-effect border-white/20 text-white"
              placeholder="https://example.com/profile-image.jpg"
            />
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

function HeroEditor({ section, onSave, isLoading }: SectionEditorProps) {
  const [formData, setFormData] = useState({
    title: section?.title || "Hero Section",
    headline: section?.metadata?.headline || "GARRY BELL",
    subtitle: section?.metadata?.subtitle || "Fighter & Stunt Performer",
    backgroundImageUrl: section?.metadata?.backgroundImageUrl || "",
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
            <Label htmlFor="background-image" className="text-white">Background Image URL</Label>
            <Input
              id="background-image"
              value={formData.backgroundImageUrl}
              onChange={(e) => setFormData({ ...formData, backgroundImageUrl: e.target.value })}
              className="glass-effect border-white/20 text-white"
              placeholder="https://example.com/hero-background.jpg"
            />
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
  // Skills editor will be implemented as a separate component
  // for managing the skills table
  return (
    <Card className="glass-effect border-white/10">
      <CardContent className="p-6">
        <p className="text-gray-400">Skills management coming soon...</p>
      </CardContent>
    </Card>
  );
}

function ContactEditor({ section, onSave, isLoading }: SectionEditorProps) {
  const [formData, setFormData] = useState({
    title: section?.title || "Contact Information",
    email: section?.metadata?.email || "",
    phone: section?.metadata?.phone || "",
    location: section?.metadata?.location || "",
    website: section?.metadata?.website || "",
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
