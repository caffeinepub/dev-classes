import { useState } from 'react';
import TeacherOnly from '../../components/auth/TeacherOnly';
import { useGetAllTopics, useAddTopic } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { FolderOpen, Plus, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Screen } from '../../App';

interface ManageTopicsScreenProps {
  onNavigate: (screen: Screen, topicId?: bigint) => void;
}

export default function ManageTopicsScreen({ onNavigate }: ManageTopicsScreenProps) {
  const { data: topics, isLoading } = useGetAllTopics();
  const addTopic = useAddTopic();
  const [newTopicName, setNewTopicName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTopicName.trim()) {
      toast.error('Please enter a topic name');
      return;
    }

    try {
      await addTopic.mutateAsync(newTopicName.trim());
      toast.success('Topic created successfully!');
      setNewTopicName('');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create topic');
      console.error(error);
    }
  };

  return (
    <TeacherOnly onNavigate={onNavigate}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Manage Topics</h2>
            <p className="text-muted-foreground">Create and organize topics for your quizzes</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
                <DialogDescription>Add a new topic to organize your quizzes</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTopic} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topicName">Topic Name</Label>
                  <Input
                    id="topicName"
                    placeholder="e.g., Mathematics, Science, History"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addTopic.isPending}>
                  {addTopic.isPending ? 'Creating...' : 'Create Topic'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading topics...</p>
          </div>
        ) : topics && topics.length > 0 ? (
          <div className="grid gap-4">
            {topics.map((topic) => (
              <Card key={topic.id.toString()} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{topic.name}</CardTitle>
                        <CardDescription>Topic ID: {topic.id.toString()}</CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onNavigate('manage-quizzes', topic.id)}
                      className="gap-2"
                    >
                      Manage Quizzes
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
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No topics yet</p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Topic
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherOnly>
  );
}
