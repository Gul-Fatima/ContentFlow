import { useRouter } from 'expo-router';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../src/components/brand/Logo';
import { Button } from '../src/components/ui/Button';
import { BRAND } from '../src/constants/brand';
import { ROUTES } from '../src/constants/routes';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center bg-sidebar px-6"
      style={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <View className="w-full max-w-[400px] items-center px-6">
        <Logo variant="onDark" size="lg" />
        <Text className="mb-12 mt-3 text-center text-base text-slate-400">
          {BRAND.tagline}
        </Text>
        <Button
          size="lg"
          fullWidth
          onPress={() => router.push(ROUTES.signUp)}
        >
          Sign up
        </Button>
        <Button
          size="lg"
          variant="secondary"
          fullWidth
          className="mt-3 border-white/20 bg-transparent active:bg-white/10"
          textClassName="text-white"
          onPress={() => router.push(ROUTES.signIn)}
        >
          Log in
        </Button>
        {Platform.OS === 'web' ? (
          <Pressable
            onPress={() => router.push(ROUTES.landing)}
            accessibilityRole="link"
            className="mt-6 rounded-sm px-2 py-2 focus:ring-2 focus:ring-primary-400"
          >
            <Text className="text-sm text-slate-400">Learn more</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
