import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Images,
  Edit,
  Grid,
  Video,
  Settings,
  X,
  Zap,
  LogOut,
} from "lucide-react";

type Section = "dashboard" | "media" | "content" | "gallery" | "videos" | "settings";

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: "dashboard" as Section, label: "Dashboard", icon: LayoutDashboard },
  { id: "media" as Section, label: "Media Library", icon: Images },
  { id: "content" as Section, label: "Content Editor", icon: Edit },
  { id: "gallery" as Section, label: "Portfolio Gallery", icon: Grid },
  { id: "videos" as Section, label: "Video Management", icon: Video },
  { id: "settings" as Section, label: "Settings", icon: Settings },
];

export default function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass-effect transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">Admin Panel</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden text-white hover:text-primary"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-white/10 text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <img
                src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.firstName || 'A'}+${user?.lastName || 'U'}&background=ff6b35&color=ffffff`}
                alt="Admin profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {user?.firstName || user?.email || "Admin"}
                </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-400 hover:text-white p-1"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
