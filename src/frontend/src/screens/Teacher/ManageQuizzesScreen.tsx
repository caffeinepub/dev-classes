import { useState } from 'react';
import TeacherOnly from '../../components/auth/TeacherOnly';
import { useGetQuizzesByTopic, useCreateQuiz, useGetAllTopics } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { FileText, Plus, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Screen } from '../../App';

interface ManageQuizzesScreenProps {
  topicId: bigint | null;
  onNavigate: (screen: Screen, topicId?: bigint, quizId?: bigint) => void;
}

export default function ManageQuizzesScreen({ topicId, onNavigate }: ManageQuizzesScreenProps) {
  const { data: topics } = useGetAllTopics();
  const { data: quizzes, isLoading } = useGetQuizzesByTopic(topicId);
  const createQuiz = useCreateQuiz();
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentTopic = topics?.find(t => t.id === topicId);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuizTitle.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    if (!topicId) {
      toast.error('No topic selected');
      return;
    }

    try {
      await createQuiz.mutateAsync({ title: newQuizTitle.trim(), topicId });
      toast.success('Quiz created successfully!');
      setNewQuizTitle('');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create quiz');
      console.error(error);
    }
  };

  if (!topicId) {
    return (
      <TeacherOnly onNavigate={onNavigate}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No topic selected</p>
          <Button onClick={() => onNavigate('manage-topics')} className="mt-4">
            Go to Topics
          </Button>
        </div>
      </TeacherOnly>
    );
  }

  return (
    <TeacherOnly onNavigate={onNavigate}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('manage-topics')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {currentTopic?.name || 'Topic'} - Quizzes
            </h2>
            <p className="text-muted-foreground">Create and manage quizzes for this topic</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Quiz
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Quiz</DialogTitle>
                <DialogDescription>Add a new quiz to {currentTopic?.name}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateQuiz} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quizTitle">Quiz Title</Label>
                  <Input
                    id="quizTitle"
                    placeholder="e.g., Chapter 1 Test, Mid-term Exam"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createQuiz.isPending}>
                  {createQuiz.isPending ? 'Creating...' : 'Create Quiz'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading quizzes...</p>
          </div>
        ) : quizzes && quizzes.length > 0 ? (
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id.toString()} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>{quiz.questions.length} question(s)</CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onNavigate('manage-questions', topicId, quiz.id)}
                      className="gap-2"
                    >
                      Manage Questions
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No quizzes yet</p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherOnly>
  );
}
