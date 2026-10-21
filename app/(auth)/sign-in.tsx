import { useState } from 'react';
import { router } from 'expo-router';
import { Switch, Text, View } from 'react-native';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { ROUTES } from '../../src/constants/routes';
import { useAuth } from '../../src/providers/AuthProvider';
import { AUTH_IS_DEMO, authErrorMessage } from '../../src/services/auth/authService';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
    setError(null);

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }

    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password, remember });
      router.replace(ROUTES.dashboard);
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-surface-page px-4 py-8">
      <Card padding="lg" className="w-full max-w-md gap-4">
        {AUTH_IS_DEMO && (
          <View className="rounded-control bg-primary-50 px-3 py-2">
            <Text className="text-xs text-primary-700">
              Demo mode: accounts are stored on this device only.
            </Text>
          </View>
        )}

        <View className="gap-1">
          <Text className="text-2xl font-bold text-ink">Log in</Text>
          <Text className="text-sm text-ink-subtle">
            Welcome back. Sign in to continue.
          </Text>
        </View>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@company.com"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          editable={!submitting}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          editable={!submitting}
          onSubmitEditing={handleSubmit}
          returnKeyType="go"
        />

        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-ink-muted">Remember me</Text>
          <Switch
            value={remember}
            onValueChange={setRemember}
            disabled={submitting}
            accessibilityLabel="Remember me"
          />
        </View>

        {error ? (
          <Text
            className="text-sm text-danger-text"
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            {error}
          </Text>
        ) : null}

        <Button size="lg" fullWidth loading={submitting} onPress={handleSubmit}>
          Sign in
        </Button>

        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-sm text-ink-subtle">New to IBDA?</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.replace(ROUTES.signUp)}
          >
            Create an account
          </Button>
        </View>
      </Card>
    </View>
  );
}
