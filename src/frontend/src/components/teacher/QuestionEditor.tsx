import { useState } from 'react';
import { useAddQuestionToQuiz } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionEditorProps {
  quizId: bigint;
  onSuccess: () => void;
}

export default function QuestionEditor({ quizId, onSuccess }: QuestionEditorProps) {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const addQuestion = useAddQuestionToQuiz();

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctAnswerIndex >= newOptions.length) {
        setCorrectAnswerIndex(newOptions.length - 1);
      }
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!questionText.trim()) {
      toast.error('Please enter a question');
      return;
    }

    const filledOptions = options.filter(opt => opt.trim());
    if (filledOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    if (options.some(opt => !opt.trim())) {
      toast.error('All options must be filled');
      return;
    }

    try {
      await addQuestion.mutateAsync({
        quizId,
        text: questionText.trim(),
        options: options.map(opt => opt.trim()),
        correctAnswerIndex: BigInt(correctAnswerIndex),
      });
      toast.success('Question added successfully!');
      setQuestionText('');
      setOptions(['', '']);
      setCorrectAnswerIndex(0);
      onSuccess();
    } catch (error) {
      toast.error('Failed to add question');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="questionText">Question</Label>
        <Textarea
          id="questionText"
          placeholder="Enter your question here..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Options ({options.length}/6)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            disabled={options.length >= 6}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Option
          </Button>
        </div>

        <RadioGroup value={correctAnswerIndex.toString()} onValueChange={(val) => setCorrectAnswerIndex(parseInt(val))}>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-sm font-medium min-w-[20px]">
                  {String.fromCharCode(65 + index)}.
                </Label>
                <Input
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground">Select the correct answer by clicking the radio button</p>
      </div>

      <Button type="submit" className="w-full" disabled={addQuestion.isPending}>
        {addQuestion.isPending ? 'Adding Question...' : 'Add Question'}
      </Button>
    </form>
  );
}
