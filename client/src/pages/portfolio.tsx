import { useQuery } from "@tanstack/react-query";
import { User, ContentSection, Skill, PortfolioItem, Video, MediaFile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Globe, Play, ExternalLink, ArrowDown, Star, Award, Target, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Portfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const { data: contentSections = [] } = useQuery<ContentSection[]>({
    queryKey: ["/api/content"],
  });

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: portfolioItems = [] } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const { data: mediaFiles = [] } = useQuery<MediaFile[]>({
    queryKey: ["/api/media"],
  });

  // Helper function to get section by key
  const getSection = (key: string) => {
    return contentSections.find(section => section.key === key);
  };

  const heroSection = getSection("hero");
  const aboutSection = getSection("about");
  const contactSection = getSection("contact");

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              GARRY BELL
            </h1>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('about')} className="hover:text-red-400 transition-colors">About</button>
              <button onClick={() => scrollToSection('skills')} className="hover:text-red-400 transition-colors">Skills</button>
              <button onClick={() => scrollToSection('portfolio')} className="hover:text-red-400 transition-colors">Portfolio</button>
              <button onClick={() => scrollToSection('videos')} className="hover:text-red-400 transition-colors">Videos</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-red-400 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-orange-900/20" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at ${50 + scrollY * 0.01}% ${50 + scrollY * 0.02}%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)`,
            }}
          />
        </div>
        
        {/* Hero Background Image */}
        {(heroSection?.metadata as any)?.backgroundImageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${(heroSection.metadata as any).backgroundImageUrl})`,
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <div className="animate-fade-in">
            <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-wider">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent drop-shadow-2xl">
                {(heroSection?.metadata as any)?.headline || "GARRY BELL"}
              </span>
            </h1>
            <p className="text-2xl md:text-4xl mb-8 font-light opacity-90 tracking-wide">
              {(heroSection?.metadata as any)?.subtitle || "Fighter & Stunt Performer"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => scrollToSection('portfolio')}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                View My Work
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToSection('contact')}
                className="border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-12 py-4 text-xl font-semibold rounded-full transition-all duration-300"
              >
                Get In Touch
              </Button>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </section>

      {/* About Section */}
      {aboutSection && (
        <section id="about" className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-black" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    {aboutSection.title}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mb-8" />
                </div>
                <p className="text-xl leading-relaxed text-gray-300">
                  {aboutSection.content}
                </p>
                <div className="grid grid-cols-3 gap-8 pt-8">
                  <div className="text-center">
                    <Star className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-white">10+</h3>
                    <p className="text-gray-400">Years Experience</p>
                  </div>
                  <div className="text-center">
                    <Award className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-white">50+</h3>
                    <p className="text-gray-400">Projects</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-white">100%</h3>
                    <p className="text-gray-400">Dedication</p>
                  </div>
                </div>
              </div>
              
              {(aboutSection.metadata as any)?.profileImageUrl && (
                <div className="flex justify-center lg:justify-end">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl transform rotate-6" />
                    <img 
                      src={(aboutSection.metadata as any).profileImageUrl}
                      alt="Profile"
                      className="relative w-96 h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6 bg-gradient-to-b from-gray-900/50 to-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Skills & Expertise
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skill, index) => (
                <Card 
                  key={skill.id} 
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-red-900/20 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">{skill.name}</h3>
                    {skill.description && (
                      <p className="text-gray-300 mb-6 leading-relaxed">{skill.description}</p>
                    )}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-1">
                          {skill.category}
                        </Badge>
                        <span className="text-red-400 font-semibold">
                          Level {skill.level}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(skill.level / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Gallery */}
      {portfolioItems.length > 0 && (
        <section id="portfolio" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Portfolio
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-red-900/20 overflow-hidden group hover:border-red-500/50 transition-all duration-500 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {(() => {
                    const coverImage = mediaFiles.find(file => file.id === item.mediaFileId);
                    if (coverImage) {
                      return (
                        <div className="aspect-video bg-gray-800 overflow-hidden">
                          <img 
                            src={coverImage.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div className="aspect-video bg-gray-800 flex items-center justify-center">
                          <div className="text-gray-400 text-center">
                            <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No Image</p>
                          </div>
                        </div>
                      );
                    }
                  })()}
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-300 mb-6 leading-relaxed">{item.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.tags?.map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="outline" 
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {item.projectUrl && (
                      <Button 
                        variant="outline" 
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 w-full"
                        asChild
                      >
                        <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Project
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <section id="videos" className="py-24 px-6 bg-gradient-to-b from-gray-900/50 to-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Video Showcase
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {videos.map((video, index) => (
                <Card 
                  key={video.id} 
                  className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-red-900/20 overflow-hidden group hover:border-red-500/50 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-video bg-gray-800 relative overflow-hidden">
                    {(() => {
                      const videoFile = mediaFiles.find(file => file.id === video.mediaFileId);
                      const thumbnailFile = video.thumbnailId ? mediaFiles.find(file => file.id === video.thumbnailId) : null;
                      const isPlaying = playingVideo === video.id;
                      
                      if (isPlaying && videoFile) {
                        return (
                          <div className="relative w-full h-full">
                            <video
                              src={videoFile.url}
                              className="w-full h-full object-cover"
                              controls
                              autoPlay
                              onEnded={() => setPlayingVideo(null)}
                            />
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute top-2 right-2 bg-black/70 hover:bg-black/90"
                              onClick={() => setPlayingVideo(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      } else if (thumbnailFile) {
                        return (
                          <img 
                            src={thumbnailFile.url}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        );
                      } else if (videoFile) {
                        return (
                          <video
                            src={videoFile.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                        );
                      } else {
                        return (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                            <Play className="w-16 h-16 text-red-400" />
                          </div>
                        );
                      }
                    })()}
                    {playingVideo !== video.id && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
                          onClick={() => setPlayingVideo(video.id)}
                        >
                          <Play className="w-6 h-6 mr-2" />
                          Play Video
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">{video.title}</h3>
                    {video.description && (
                      <p className="text-gray-300 leading-relaxed">{video.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {contactSection && (
        <section id="contact" className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Get In Touch
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-8" />
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Ready to work together? Let's create something amazing.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(contactSection.metadata as any)?.email && (
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-red-900/20 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-bold text-lg mb-4">Email</p>
                    <a 
                      href={`mailto:${(contactSection.metadata as any).email}`}
                      className="text-gray-300 hover:text-red-400 transition-colors break-all"
                    >
                      {(contactSection.metadata as any).email}
                    </a>
                  </CardContent>
                </Card>
              )}
              
              {(contactSection.metadata as any)?.phone && (
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-red-900/20 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-bold text-lg mb-4">Phone</p>
                    <a 
                      href={`tel:${(contactSection.metadata as any).phone}`}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      {(contactSection.metadata as any).phone}
                    </a>
                  </CardContent>
                </Card>
              )}
              
              {(contactSection.metadata as any)?.location && (
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-red-900/20 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-bold text-lg mb-4">Location</p>
                    <p className="text-gray-300">{(contactSection.metadata as any).location}</p>
                  </CardContent>
                </Card>
              )}
              
              {(contactSection.metadata as any)?.website && (
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-red-900/20 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-bold text-lg mb-4">Website</p>
                    <a 
                      href={(contactSection.metadata as any).website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-red-400 transition-colors break-all"
                    >
                      Visit Website
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black py-12 px-6 text-center border-t border-red-900/20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            GARRY BELL
          </h3>
          <p className="text-gray-400 mb-8">Fighter & Stunt Performer</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-8" />
          <p className="text-gray-500">
            © 2024 {user?.firstName} {user?.lastName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}