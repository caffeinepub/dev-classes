import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerUserRole } from './useQueries';

export function useCurrentUser() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();

  const isAuthenticated = !!identity;
  const isLoading = profileLoading || roleLoading;

  const role = userRole || 'guest';
  const isTeacher = role === 'admin';
  const isStudent = role === 'user';

  return {
    identity,
    userProfile,
    userRole: role,
    isAuthenticated,
    isTeacher,
    isStudent,
    isLoading,
    isFetched,
  };
}
