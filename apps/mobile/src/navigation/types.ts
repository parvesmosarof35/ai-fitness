import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  CheckEmail: undefined;
  NewPassword: undefined;
};

export type OnboardingStackParamList = {
  OnboardingStart: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Meals: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type WorkoutStackParamList = {
  WorkoutList: undefined;
  WorkoutOverview: { workoutId: string };
  ActiveSession: undefined;
  CameraTracker: { exerciseName: string };
  WorkoutComplete: undefined;
};

export type RootStackParamList = {
  Intro: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  AICoachChat: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
