import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '../../backend';

export default function RoleClaimScreen() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const assignRole = useMutation({
    mutationFn: async (role: UserRole) => {
      if (!actor || !identity) throw new Error('Not authenticated');
      await actor.assignCallerUserRole(identity.getPrincipal(), role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Role assigned successfully!');
    },
    onError: () => {
      toast.error('Failed to assign role');
    },
  });

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Role</h2>
          <p className="text-muted-foreground">Select how you want to use Dev Classes</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => assignRole.mutate(UserRole.admin)}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Teacher</CardTitle>
              <CardDescription>Create and manage quizzes for your students</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Create topics and quizzes</li>
                <li>• Add multiple-choice questions</li>
                <li>• View student results</li>
                <li>• Manage all content</li>
              </ul>
              <Button 
                className="w-full" 
                disabled={assignRole.isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  assignRole.mutate(UserRole.admin);
                }}
              >
                {assignRole.isPending ? 'Setting up...' : 'I am a Teacher'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => assignRole.mutate(UserRole.user)}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle>Student</CardTitle>
              <CardDescription>Take quizzes and track your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Browse available topics</li>
                <li>• Take quizzes and tests</li>
                <li>• View your scores</li>
                <li>• Track your progress</li>
              </ul>
              <Button 
                className="w-full" 
                variant="secondary"
                disabled={assignRole.isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  assignRole.mutate(UserRole.user);
                }}
              >
                {assignRole.isPending ? 'Setting up...' : 'I am a Student'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
