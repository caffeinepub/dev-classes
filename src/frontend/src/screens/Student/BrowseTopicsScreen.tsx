import { useGetAllTopics } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FolderOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import type { Screen } from '../../App';

interface BrowseTopicsScreenProps {
  onNavigate: (screen: Screen, topicId?: bigint) => void;
}

export default function BrowseTopicsScreen({ onNavigate }: BrowseTopicsScreenProps) {
  const { data: topics, isLoading } = useGetAllTopics();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('student-home')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Browse Topics</h2>
        <p className="text-muted-foreground">Select a topic to view available quizzes</p>
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
                      <CardDescription>Explore quizzes in this topic</CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onNavigate('browse-quizzes', topic.id)}
                    className="gap-2"
                  >
                    View Quizzes
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
            <p className="text-muted-foreground">No topics available yet</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new content</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
