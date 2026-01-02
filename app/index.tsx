import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    // Redirect to onboarding/welcome screen on app start
    // In a real app, you'd check authentication state here
    router.replace("/(auth)/onboarding/welcome");
  }, []);

  return null;
}
