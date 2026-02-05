import { useState } from 'react';
import TeacherOnly from '../../components/auth/TeacherOnly';
import { useGetQuiz } from '../../hooks/useQueries';
import QuestionEditor from '../../components/teacher/QuestionEditor';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { ArrowLeft, Plus, HelpCircle } from 'lucide-react';
import type { Screen } from '../../App';

interface ManageQuestionsScreenProps {
  quizId: bigint | null;
  onNavigate: (screen: Screen, topicId?: bigint, quizId?: bigint) => void;
}

export default function ManageQuestionsScreen({ quizId, onNavigate }: ManageQuestionsScreenProps) {
  const { data: quiz, isLoading } = useGetQuiz(quizId);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!quizId) {
    return (
      <TeacherOnly onNavigate={onNavigate}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No quiz selected</p>
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => quiz && onNavigate('manage-quizzes', quiz.topicId)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {quiz?.title || 'Quiz'} - Questions
            </h2>
            <p className="text-muted-foreground">Add and manage questions for this quiz</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
                <DialogDescription>Create a multiple-choice question</DialogDescription>
              </DialogHeader>
              <QuestionEditor 
                quizId={quizId} 
                onSuccess={() => setDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        ) : quiz && quiz.questions.length > 0 ? (
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <Card key={question.id.toString()}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-2">
                    <span className="text-muted-foreground">Q{index + 1}.</span>
                    <span>{question.text}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        className={`p-3 rounded-lg border ${
                          Number(question.correctAnswerIndex) === optIndex
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{String.fromCharCode(65 + optIndex)}.</span>
                          <span className="text-sm">{option}</span>
                          {Number(question.correctAnswerIndex) === optIndex && (
                            <span className="ml-auto text-xs text-primary font-medium">Correct Answer</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No questions yet</p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Question
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherOnly>
  );
}
