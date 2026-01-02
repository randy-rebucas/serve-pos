import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthProvider";
import { useEffect } from "react";
import { isApiUrlConfigured, getApiBaseUrl, getApiConfigInfo } from "../lib/api/config";
import { requestNotificationPermissions } from "../lib/utils/notifications";

export default function RootLayout() {
  useEffect(() => {
    // Log API configuration status in development
    if (__DEV__) {
      const isConfigured = isApiUrlConfigured();
      console.log('📱 ServePOS App Starting...');
      console.log('🔧 API Configuration:');
      console.log(`   URL: ${getApiBaseUrl()}`);
      console.log(`   Status: ${isConfigured ? '✅ Configured' : '⚠️  NOT CONFIGURED (using placeholder)'}`);
      
      if (!isConfigured) {
        console.warn('\n⚠️  API URL NOT CONFIGURED!');
        console.warn('To fix: Create a .env file with EXPO_PUBLIC_API_URL=http://YOUR_IP:PORT/api');
        console.warn('Example: EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api');
        console.warn('Then restart the Expo dev server.\n');
      }
      
      console.log(getApiConfigInfo());
    }

    // Initialize notifications
    requestNotificationPermissions().catch((error) => {
      console.error('Failed to initialize notifications:', error);
    });
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
