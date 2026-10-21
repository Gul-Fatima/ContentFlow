import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Logo } from '../src/components/brand/Logo';
import { AuthProvider, useAuth } from '../src/providers/AuthProvider';

/**
 * Route guards.  - authenticated : (app) + onboarding
 *                - logged out    : (auth) + welcome (+ password reset)
 *                - always        : index, landing, demo
 *
 * While the session is restored (`status === 'loading'`) the navigator is not
 * mounted at all: mounting it with every guard closed would reject the current
 * URL and drop deep links such as /approval back to the anchor route.
 */
function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    // Branded splash frame; the animated version lands in task B2.
    return (
      <View className="flex-1 items-center justify-center bg-sidebar">
        <Logo variant="onDark" />
      </View>
    );
  }

  const isAuthenticated = status === 'authenticated';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="landing" />
      <Stack.Screen name="demo" />
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="forgot-password" />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
