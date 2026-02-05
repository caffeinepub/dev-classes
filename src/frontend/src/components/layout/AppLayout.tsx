import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { BookOpen, LogOut, Home } from 'lucide-react';
import type { Screen } from '../../App';

interface AppLayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function AppLayout({ children, currentScreen, onNavigate }: AppLayoutProps) {
  const { identity, clear, isLoggingIn } = useInternetIdentity();
  const { userProfile, isTeacher, isStudent } = useCurrentUser();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    onNavigate('landing');
  };

  const handleHomeClick = () => {
    if (isTeacher) {
      onNavigate('teacher-home');
    } else if (isStudent) {
      onNavigate('student-home');
    } else {
      onNavigate('landing');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/dev-classes-logo.dim_512x512.png" 
                alt="Dev Classes Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dev Classes</h1>
                <p className="text-xs text-muted-foreground">Learn. Test. Excel.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated && userProfile && currentScreen !== 'landing' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHomeClick}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              )}
              
              {isAuthenticated && userProfile && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-foreground">{userProfile.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userProfile.role}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoggingIn}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border bg-card py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">caffeine.ai</a></p>
        </div>
      </footer>
    </div>
  );
}
