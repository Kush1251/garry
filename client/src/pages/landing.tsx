import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)" }}>
      <Card className="w-full max-w-md glass-effect border-primary/30">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400 mb-6">
            Access your portfolio management dashboard
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Please log in to manage your content, media, and portfolio settings.
          </p>
          
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full gradient-primary hover:shadow-lg transition-all"
          >
            Log In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
