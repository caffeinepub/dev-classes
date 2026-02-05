import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap, BookOpen, CheckCircle } from 'lucide-react';
import type { Screen } from '../App';

interface LandingScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function LandingScreen({ onNavigate }: LandingScreenProps) {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { isTeacher, isStudent, userProfile } = useCurrentUser();

  const isAuthenticated = !!identity;

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      login();
    } else if (isTeacher) {
      onNavigate('teacher-home');
    } else if (isStudent) {
      onNavigate('student-home');
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section 
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 p-8 md:p-16"
        style={{
          backgroundImage: 'url(/assets/generated/dev-classes-hero-bg.dim_1600x600.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to Dev Classes
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A modern quiz platform for teachers to create topic-wise tests and students to excel in their learning journey
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            disabled={isLoggingIn}
            className="text-lg px-8 py-6"
          >
            {isLoggingIn ? 'Connecting...' : isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>For Teachers</CardTitle>
            <CardDescription>Create and manage comprehensive quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Organize content by topics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Create multiple-choice questions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Track student performance</span>
              </li>
            </ul>
            {isAuthenticated && isTeacher && (
              <Button 
                className="w-full mt-6" 
                onClick={() => onNavigate('teacher-home')}
              >
                Go to Teacher Dashboard
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle>For Students</CardTitle>
            <CardDescription>Take quizzes and improve your knowledge</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Browse topics and quizzes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Get instant feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Review your answers</span>
              </li>
            </ul>
            {isAuthenticated && isStudent && (
              <Button 
                className="w-full mt-6" 
                variant="secondary"
                onClick={() => onNavigate('student-home')}
              >
                Go to Student Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
