import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import Dashboard from "@/components/admin/Dashboard";
import MediaLibrary from "@/components/admin/MediaLibrary";
import ContentEditor from "@/components/admin/ContentEditor";
import Gallery from "@/components/admin/Gallery";
import VideoManager from "@/components/admin/VideoManager";
import Settings from "@/components/admin/Settings";

type Section = "dashboard" | "media" | "content" | "gallery" | "videos" | "settings";

export default function Admin() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onSectionChange={setActiveSection} />;
      case "media":
        return <MediaLibrary />;
      case "content":
        return <ContentEditor />;
      case "gallery":
        return <Gallery />;
      case "videos":
        return <VideoManager />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  const getSectionTitle = () => {
    const titles: Record<Section, string> = {
      dashboard: "Dashboard",
      media: "Media Library",
      content: "Content Editor",
      gallery: "Portfolio Gallery",
      videos: "Video Management",
      settings: "Settings",
    };
    return titles[activeSection];
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header
          title={getSectionTitle()}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
