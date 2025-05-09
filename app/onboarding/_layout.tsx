import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="speek-freely" />
      <Stack.Screen name="get-understood" />
      <Stack.Screen name="speech-impairment" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}