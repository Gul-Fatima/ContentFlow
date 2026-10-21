import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Logo } from '../src/components/brand/Logo';
import { Button } from '../src/components/ui/Button';
import { BRAND } from '../src/constants/brand';
import { ROUTES } from '../src/constants/routes';

/** Logged-out entry choice. Visual design is finalised in task B2. */
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-8 bg-sidebar px-6">
      <Logo variant="onDark" />
      <Text className="max-w-sm text-center text-ink-faint">
        {BRAND.tagline}
      </Text>

      <View className="w-full max-w-sm gap-3">
        <Button size="lg" fullWidth onPress={() => router.push(ROUTES.signUp)}>
          Sign up
        </Button>
        <Button
          size="lg"
          variant="secondary"
          fullWidth
          onPress={() => router.push(ROUTES.signIn)}
        >
          Log in
        </Button>
      </View>
    </View>
  );
}
