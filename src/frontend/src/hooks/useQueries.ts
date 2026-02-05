import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TopicData, Quiz, UserProfile, Attempt } from '../backend';

// Topics
export function useGetAllTopics() {
  const { actor, isFetching } = useActor();

  return useQuery<TopicData[]>({
    queryKey: ['topics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTopics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTopic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTopic(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });
}

// Quizzes
export function useGetQuizzesByTopic(topicId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Quiz[]>({
    queryKey: ['quizzes', topicId?.toString()],
    queryFn: async () => {
      if (!actor || topicId === null) return [];
      return actor.getQuizzesByTopic(topicId);
    },
    enabled: !!actor && !isFetching && topicId !== null,
  });
}

export function useGetQuiz(quizId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Quiz | null>({
    queryKey: ['quiz', quizId?.toString()],
    queryFn: async () => {
      if (!actor || quizId === null) return null;
      return actor.getQuiz(quizId);
    },
    enabled: !!actor && !isFetching && quizId !== null,
  });
}

export function useCreateQuiz() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, topicId }: { title: string; topicId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createQuiz(title, topicId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', variables.topicId.toString()] });
    },
  });
}

// Questions
export function useAddQuestionToQuiz() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quizId,
      text,
      options,
      correctAnswerIndex,
    }: {
      quizId: bigint;
      text: string;
      options: string[];
      correctAnswerIndex: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addQuestionToQuiz(quizId, text, options, correctAnswerIndex);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId.toString()] });
    },
  });
}

// Attempts
export function useSubmitAttempt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quizId, answers }: { quizId: bigint; answers: bigint[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitAttempt(quizId, answers);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attempts', variables.quizId.toString()] });
    },
  });
}

export function useGetCallerAttemptsByQuiz(quizId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Attempt[]>({
    queryKey: ['attempts', quizId?.toString()],
    queryFn: async () => {
      if (!actor || quizId === null) return [];
      return actor.getCallerAttemptsByQuiz(quizId);
    },
    enabled: !!actor && !isFetching && quizId !== null,
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
  });
}

// User Role
export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<string>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
