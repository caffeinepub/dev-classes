import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import type { QuestionData } from '../../backend';

interface QuestionRendererProps {
  question: QuestionData;
  questionNumber: number;
  selectedAnswer?: bigint;
  onAnswerChange: (answerIndex: bigint) => void;
  showCorrectAnswer?: boolean;
}

export default function QuestionRenderer({ 
  question, 
  questionNumber, 
  selectedAnswer,
  onAnswerChange,
  showCorrectAnswer = false
}: QuestionRendererProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-start gap-2">
          <span className="text-muted-foreground">Q{questionNumber}.</span>
          <span>{question.text}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedAnswer?.toString()} 
          onValueChange={(val) => onAnswerChange(BigInt(val))}
        >
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isCorrect = Number(question.correctAnswerIndex) === index;
              const isSelected = selectedAnswer !== undefined && Number(selectedAnswer) === index;
              
              let className = 'flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50';
              
              if (showCorrectAnswer) {
                if (isCorrect) {
                  className += ' border-primary bg-primary/5';
                } else if (isSelected && !isCorrect) {
                  className += ' border-destructive bg-destructive/5';
                }
              } else if (isSelected) {
                className += ' border-primary bg-primary/5';
              }

              return (
                <div key={index} className={className}>
                  <RadioGroupItem value={index.toString()} id={`q${question.id}-opt${index}`} />
                  <Label 
                    htmlFor={`q${question.id}-opt${index}`} 
                    className="flex-1 cursor-pointer font-normal"
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Label>
                  {showCorrectAnswer && isCorrect && (
                    <span className="text-xs text-primary font-medium">Correct</span>
                  )}
                  {showCorrectAnswer && isSelected && !isCorrect && (
                    <span className="text-xs text-destructive font-medium">Your Answer</span>
                  )}
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
