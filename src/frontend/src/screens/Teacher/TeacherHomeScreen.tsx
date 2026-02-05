import TeacherOnly from '../../components/auth/TeacherOnly';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FolderOpen, FileText, PlusCircle } from 'lucide-react';
import type { Screen } from '../../App';

interface TeacherHomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function TeacherHomeScreen({ onNavigate }: TeacherHomeScreenProps) {
  return (
    <TeacherOnly onNavigate={onNavigate}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Teacher Dashboard</h2>
          <p className="text-muted-foreground">Manage your topics, quizzes, and questions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Manage Topics</CardTitle>
              <CardDescription>Create and organize topics for your quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full gap-2" 
                onClick={() => onNavigate('manage-topics')}
              >
                <PlusCircle className="h-4 w-4" />
                View Topics
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>Browse All Content</CardTitle>
              <CardDescription>View all topics to manage quizzes and questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full gap-2" 
                variant="secondary"
                onClick={() => onNavigate('manage-topics')}
              >
                Browse Content
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherOnly>
  );
}
