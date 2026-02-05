import { useGetQuiz } from '../../hooks/useQueries';
import QuestionRenderer from '../../components/student/QuestionRenderer';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { CheckCircle, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import type { Screen } from '../../App';

interface QuizResultScreenProps {
  quizId: bigint | null;
  score: number | null;
  answers: bigint[];
  onNavigate: (screen: Screen, topicId?: bigint, quizId?: bigint) => void;
}

export default function QuizResultScreen({ quizId, score, answers, onNavigate }: QuizResultScreenProps) {
  const { data: quiz } = useGetQuiz(quizId);

  if (!quiz || score === null) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results available</p>
        <Button onClick={() => onNavigate('browse-topics')} className="mt-4">
          Go to Topics
        </Button>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onNavigate('browse-quizzes', quiz.topicId)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </Button>
      </div>

      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className={`mx-auto mb-4 h-20 w-20 rounded-full flex items-center justify-center ${
            percentage >= 70 ? 'bg-primary/10' : 'bg-destructive/10'
          }`}>
            {percentage >= 70 ? (
              <CheckCircle className="h-10 w-10 text-primary" />
            ) : (
              <XCircle className="h-10 w-10 text-destructive" />
            )}
          </div>
          <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
          <CardDescription className="text-lg">{quiz.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">{score}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">{totalQuestions - score}</p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">{percentage}%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="flex-1 gap-2"
              onClick={() => onNavigate('take-quiz', quiz.topicId, quiz.id)}
            >
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => onNavigate('browse-quizzes', quiz.topicId)}
            >
              Browse Quizzes
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Review Your Answers</h3>
        <div className="space-y-4">
          {quiz.questions.map((question, index) => (
            <QuestionRenderer
              key={question.id.toString()}
              question={question}
              questionNumber={index + 1}
              selectedAnswer={answers[index]}
              onAnswerChange={() => {}}
              showCorrectAnswer={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
