import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Globe, Play } from "lucide-react";
import type { ContentSection, MediaFile, PortfolioItem, Video, Skill } from "@shared/schema";

export default function Portfolio() {
  const { data: contentSections } = useQuery<ContentSection[]>({
    queryKey: ["/api/content"],
    retry: false,
  });

  const { data: mediaFiles } = useQuery<MediaFile[]>({
    queryKey: ["/api/media"],
    retry: false,
  });

  const { data: portfolioItems } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
    retry: false,
  });

  const { data: videos } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
    retry: false,
  });

  const { data: skills } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
    retry: false,
  });

  const getContentSection = (key: string) => {
    return contentSections?.find(section => section.key === key);
  };

  const getMediaFile = (mediaFileId: number | null) => {
    if (!mediaFileId) return null;
    return mediaFiles?.find(file => file.id === mediaFileId);
  };

  const heroSection = getContentSection("hero");
  const aboutSection = getContentSection("about");
  const contactSection = getContentSection("contact");

  const publicVideos = videos?.filter(video => video.visibility === "public") || [];
  const featuredVideo = publicVideos[0];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)" }}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-primary">
            {heroSection?.metadata?.headline || "GARRY BELL"}
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#about" className="text-white hover:text-primary transition-colors">About</a>
            <a href="#skills" className="text-white hover:text-primary transition-colors">Skills</a>
            <a href="#portfolio" className="text-white hover:text-primary transition-colors">Portfolio</a>
            <a href="#videos" className="text-white hover:text-primary transition-colors">Videos</a>
            <a href="#contact" className="text-white hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {heroSection?.metadata?.backgroundImageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroSection.metadata.backgroundImageUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-6">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-fade-in">
            {heroSection?.metadata?.headline || "GARRY BELL"}
          </h1>
          <p className="text-xl md:text-2xl text-primary mb-8 animate-fade-in-delay">
            {heroSection?.metadata?.subtitle || "Fighter & Stunt Performer"}
          </p>
          <Button 
            className="gradient-primary px-8 py-3 text-lg rounded-full animate-fade-in-delay-2"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Discover My Work
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16">
            {aboutSection?.title || "About Me"}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="text-lg leading-relaxed text-gray-300 space-y-6">
                {aboutSection?.content ? (
                  aboutSection.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>Professional fighter and stunt performer bringing authentic combat to film and television.</p>
                )}
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              {aboutSection?.metadata?.profileImageUrl ? (
                <img
                  src={aboutSection.metadata.profileImageUrl}
                  alt="Profile"
                  className="w-80 h-96 object-cover rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-80 h-96 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <p className="text-gray-400">Profile image</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section id="skills" className="py-20 px-6 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skill) => (
                <Card key={skill.id} className="glass-effect border-white/10 text-center p-6">
                  <CardContent className="p-0">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-primary flex items-center justify-center relative">
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(hsl(var(--primary)) 0% ${skill.level}%, rgba(255,255,255,0.1) ${skill.level}% 100%)`
                        }}
                      />
                      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center relative z-10">
                        <span className="text-sm font-bold text-primary">{skill.level}%</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
                    {skill.description && (
                      <p className="text-gray-400 text-sm">{skill.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Gallery */}
      {portfolioItems && portfolioItems.length > 0 && (
        <section id="portfolio" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16">Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item) => {
                const mediaFile = getMediaFile(item.mediaFileId);
                return (
                  <Card key={item.id} className="glass-effect border-white/10 overflow-hidden group">
                    <div className="aspect-video relative">
                      {mediaFile ? (
                        <img
                          src={mediaFile.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <p className="text-gray-400">No image</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center text-white">
                          <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                          {item.category && (
                            <span className="px-3 py-1 bg-primary rounded-full text-sm capitalize">
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Video Reel */}
      {featuredVideo && (
        <section id="videos" className="py-20 px-6 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16">Video Reel</h2>
            <div className="max-w-4xl mx-auto">
              <Card className="glass-effect border-white/10 overflow-hidden">
                <div className="aspect-video relative">
                  {(() => {
                    const videoFile = getMediaFile(featuredVideo.mediaFileId);
                    const thumbnailFile = getMediaFile(featuredVideo.thumbnailId);
                    
                    if (videoFile) {
                      return (
                        <video
                          src={videoFile.url}
                          poster={thumbnailFile?.url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      );
                    }
                    return (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Play className="w-16 h-16 text-gray-400" />
                      </div>
                    );
                  })()}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{featuredVideo.title}</h3>
                  {featuredVideo.description && (
                    <p className="text-gray-400">{featuredVideo.description}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16">
            {contactSection?.title || "Get In Touch"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {contactSection?.metadata?.email && (
              <Card className="glass-effect border-white/10 p-6 text-center">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Email</h3>
                <p className="text-gray-400">{contactSection.metadata.email}</p>
              </Card>
            )}
            {contactSection?.metadata?.phone && (
              <Card className="glass-effect border-white/10 p-6 text-center">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Phone</h3>
                <p className="text-gray-400">{contactSection.metadata.phone}</p>
              </Card>
            )}
            {contactSection?.metadata?.location && (
              <Card className="glass-effect border-white/10 p-6 text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Location</h3>
                <p className="text-gray-400">{contactSection.metadata.location}</p>
              </Card>
            )}
            {contactSection?.metadata?.website && (
              <Card className="glass-effect border-white/10 p-6 text-center">
                <Globe className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Website</h3>
                <p className="text-gray-400">{contactSection.metadata.website}</p>
              </Card>
            )}
          </div>
          <Button className="gradient-primary px-8 py-3 text-lg rounded-full">
            Start a Conversation
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 {heroSection?.metadata?.headline || "Garry Bell"}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}