import { Button } from "@/components/ui/button";
import { Menu, Eye, Save } from "lucide-react";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="glass-effect border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden text-white hover:text-primary p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="glass-effect border-white/20 text-white hover:bg-white/10"
            onClick={() => window.open('/portfolio', '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Site
          </Button>
          <Button className="gradient-primary hover:shadow-lg transition-all">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </header>
  );
}
