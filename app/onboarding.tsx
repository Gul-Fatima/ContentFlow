import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { ROUTES } from '../src/constants/routes';

/** Placeholder for the onboarding flow (screens arrive in a later task). */
export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-surface-page px-6">
      <Text className="text-center text-2xl font-bold text-ink">
        Welcome to IBDA
      </Text>
      <Text className="max-w-sm text-center text-ink-subtle">
        Onboarding steps will guide you through connecting your brand.
      </Text>
      <Button
        variant="secondary"
        size="lg"
        onPress={() => router.replace(ROUTES.dashboard)}
      >
        Skip for now
      </Button>
    </View>
  );
}
