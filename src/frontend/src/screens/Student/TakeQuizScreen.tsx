import { useState } from 'react';
import { useGetQuiz, useSubmitAttempt } from '../../hooks/useQueries';
import QuestionRenderer from '../../components/student/QuestionRenderer';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { Screen } from '../../App';

interface TakeQuizScreenProps {
  quizId: bigint | null;
  onNavigate: (screen: Screen, topicId?: bigint, quizId?: bigint) => void;
  onSubmit: (score: number, answers: bigint[]) => void;
}

export default function TakeQuizScreen({ quizId, onNavigate, onSubmit }: TakeQuizScreenProps) {
  const { data: quiz, isLoading } = useGetQuiz(quizId);
  const submitAttempt = useSubmitAttempt();
  const [answers, setAnswers] = useState<Map<bigint, bigint>>(new Map());

  const handleAnswerChange = (questionId: bigint, answerIndex: bigint) => {
    setAnswers(new Map(answers.set(questionId, answerIndex)));
  };

  const handleSubmit = async () => {
    if (!quiz || !quizId) return;

    // Check if all questions are answered
    if (answers.size !== quiz.questions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    // Build answers array in question order
    const answersArray = quiz.questions.map(q => answers.get(q.id) ?? BigInt(0));

    try {
      const score = await submitAttempt.mutateAsync({ quizId, answers: answersArray });
      toast.success('Quiz submitted successfully!');
      onSubmit(Number(score), answersArray);
    } catch (error) {
      toast.error('Failed to submit quiz');
      console.error(error);
    }
  };

  if (!quizId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No quiz selected</p>
        <Button onClick={() => onNavigate('browse-topics')} className="mt-4">
          Go to Topics
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Quiz not found</p>
        <Button onClick={() => onNavigate('browse-topics')} className="mt-4">
          Go to Topics
        </Button>
      </div>
    );
  }

  const progress = (answers.size / quiz.questions.length) * 100;

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

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <CardDescription>{quiz.questions.length} questions</CardDescription>
          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{answers.size} / {quiz.questions.length}</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <QuestionRenderer
            key={question.id.toString()}
            question={question}
            questionNumber={index + 1}
            selectedAnswer={answers.get(question.id)}
            onAnswerChange={(answerIndex) => handleAnswerChange(question.id, answerIndex)}
          />
        ))}
      </div>

      <Card className="sticky bottom-4 shadow-lg">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Answered: </span>
              <span className="font-medium">{answers.size} / {quiz.questions.length}</span>
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={submitAttempt.isPending || answers.size !== quiz.questions.length}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {submitAttempt.isPending ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
