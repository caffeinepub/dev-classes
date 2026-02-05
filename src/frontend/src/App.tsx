import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useState } from 'react';
import LandingScreen from './screens/LandingScreen';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import RoleClaimScreen from './components/auth/RoleClaimScreen';
import TeacherHomeScreen from './screens/Teacher/TeacherHomeScreen';
import StudentHomeScreen from './screens/Student/StudentHomeScreen';
import ManageTopicsScreen from './screens/Teacher/ManageTopicsScreen';
import ManageQuizzesScreen from './screens/Teacher/ManageQuizzesScreen';
import ManageQuestionsScreen from './screens/Teacher/ManageQuestionsScreen';
import BrowseTopicsScreen from './screens/Student/BrowseTopicsScreen';
import BrowseQuizzesScreen from './screens/Student/BrowseQuizzesScreen';
import TakeQuizScreen from './screens/Student/TakeQuizScreen';
import QuizResultScreen from './screens/Student/QuizResultScreen';
import AppLayout from './components/layout/AppLayout';
import { Toaster } from './components/ui/sonner';

export type Screen = 
  | 'landing'
  | 'teacher-home'
  | 'manage-topics'
  | 'manage-quizzes'
  | 'manage-questions'
  | 'student-home'
  | 'browse-topics'
  | 'browse-quizzes'
  | 'take-quiz'
  | 'quiz-result';

export default function App() {
  const { identity } = useInternetIdentity();
  const { userProfile, userRole, isLoading: userLoading, isFetched } = useCurrentUser();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedTopicId, setSelectedTopicId] = useState<bigint | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<bigint | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<bigint[]>([]);

  const isAuthenticated = !!identity;

  // Show profile setup modal when user is authenticated but has no profile
  const showProfileSetup = isAuthenticated && !userLoading && isFetched && userProfile === null;

  // Show role claim screen when user has profile but no role set
  const showRoleClaim = isAuthenticated && userProfile !== null && userRole === 'guest';

  // Navigation helpers
  const navigateTo = (screen: Screen, topicId?: bigint, quizId?: bigint) => {
    setCurrentScreen(screen);
    if (topicId !== undefined) setSelectedTopicId(topicId);
    if (quizId !== undefined) setSelectedQuizId(quizId);
  };

  const handleQuizSubmit = (score: number, answers: bigint[]) => {
    setQuizScore(score);
    setSubmittedAnswers(answers);
    navigateTo('quiz-result');
  };

  // Render current screen
  const renderScreen = () => {
    if (!isAuthenticated) {
      return <LandingScreen onNavigate={navigateTo} />;
    }

    if (showProfileSetup) {
      return <ProfileSetupModal />;
    }

    if (showRoleClaim) {
      return <RoleClaimScreen />;
    }

    switch (currentScreen) {
      case 'landing':
        return <LandingScreen onNavigate={navigateTo} />;
      case 'teacher-home':
        return <TeacherHomeScreen onNavigate={navigateTo} />;
      case 'manage-topics':
        return <ManageTopicsScreen onNavigate={navigateTo} />;
      case 'manage-quizzes':
        return <ManageQuizzesScreen topicId={selectedTopicId} onNavigate={navigateTo} />;
      case 'manage-questions':
        return <ManageQuestionsScreen quizId={selectedQuizId} onNavigate={navigateTo} />;
      case 'student-home':
        return <StudentHomeScreen onNavigate={navigateTo} />;
      case 'browse-topics':
        return <BrowseTopicsScreen onNavigate={navigateTo} />;
      case 'browse-quizzes':
        return <BrowseQuizzesScreen topicId={selectedTopicId} onNavigate={navigateTo} />;
      case 'take-quiz':
        return <TakeQuizScreen quizId={selectedQuizId} onNavigate={navigateTo} onSubmit={handleQuizSubmit} />;
      case 'quiz-result':
        return <QuizResultScreen quizId={selectedQuizId} score={quizScore} answers={submittedAnswers} onNavigate={navigateTo} />;
      default:
        return <LandingScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <AppLayout currentScreen={currentScreen} onNavigate={navigateTo}>
      {renderScreen()}
      <Toaster />
    </AppLayout>
  );
}
