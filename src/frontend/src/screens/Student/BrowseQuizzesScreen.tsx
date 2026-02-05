import { useGetQuizzesByTopic, useGetAllTopics } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FileText, Play, ArrowLeft } from 'lucide-react';
import type { Screen } from '../../App';

interface BrowseQuizzesScreenProps {
  topicId: bigint | null;
  onNavigate: (screen: Screen, topicId?: bigint, quizId?: bigint) => void;
}

export default function BrowseQuizzesScreen({ topicId, onNavigate }: BrowseQuizzesScreenProps) {
  const { data: topics } = useGetAllTopics();
  const { data: quizzes, isLoading } = useGetQuizzesByTopic(topicId);

  const currentTopic = topics?.find(t => t.id === topicId);

  if (!topicId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No topic selected</p>
        <Button onClick={() => onNavigate('browse-topics')} className="mt-4">
          Go to Topics
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('browse-topics')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Topics
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {currentTopic?.name || 'Topic'} - Quizzes
        </h2>
        <p className="text-muted-foreground">Select a quiz to start testing your knowledge</p>
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
                    size="sm"
                    onClick={() => onNavigate('take-quiz', topicId, quiz.id)}
                    className="gap-2"
                    disabled={quiz.questions.length === 0}
                  >
                    <Play className="h-4 w-4" />
                    Start Quiz
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
            <p className="text-muted-foreground">No quizzes available in this topic yet</p>
            <Button onClick={() => onNavigate('browse-topics')} variant="outline" className="mt-4">
              Browse Other Topics
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
