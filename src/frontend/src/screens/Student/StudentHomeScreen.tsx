import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, TrendingUp } from 'lucide-react';
import type { Screen } from '../../App';

interface StudentHomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function StudentHomeScreen({ onNavigate }: StudentHomeScreenProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Student Dashboard</h2>
        <p className="text-muted-foreground">Browse topics and take quizzes to test your knowledge</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Browse Quizzes</CardTitle>
            <CardDescription>Explore available topics and take quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => onNavigate('browse-topics')}
            >
              Start Learning
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your quiz attempts and scores</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Take quizzes to see your progress here</p>
            <Button 
              variant="secondary"
              className="w-full"
              onClick={() => onNavigate('browse-topics')}
            >
              View Topics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
