import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '../src/components/ui/Button';

/** Placeholder: the reset request flow is built in task B2. */
export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-surface-page px-6">
      <Text className="text-2xl font-bold text-ink">Reset your password</Text>
      <Text className="max-w-sm text-center text-ink-subtle">
        Password reset isn&apos;t available yet.
      </Text>
      <Button variant="secondary" onPress={() => router.back()}>
        Back to log in
      </Button>
    </View>
  );
}
