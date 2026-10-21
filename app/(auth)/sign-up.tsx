import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { ROUTES } from '../../src/constants/routes';
import { useAuth } from '../../src/providers/AuthProvider';
import { AUTH_IS_DEMO, authErrorMessage } from '../../src/services/auth/authService';
import { palette } from '../../src/lib/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function SignUpScreen() {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): string | null => {
    if (name.trim().length < 2) return 'Enter your full name.';
    if (!EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email address.';
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (password !== confirmPassword) return 'Passwords do not match.';
    if (!acceptedTerms) return 'Please accept the terms to continue.';
    return null;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      router.replace(ROUTES.onboarding);
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
          <Text className="text-2xl font-bold text-ink">Create your account</Text>
          <Text className="text-sm text-ink-subtle">
            Start managing your social presence with IBDA.
          </Text>
        </View>

        <Input
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Alex Morgan"
          autoComplete="name"
          textContentType="name"
          editable={!submitting}
        />

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
          placeholder="At least 8 characters"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          editable={!submitting}
        />

        <Input
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repeat your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          editable={!submitting}
          onSubmitEditing={handleSubmit}
          returnKeyType="go"
        />

        <Pressable
          onPress={() => setAcceptedTerms((value) => !value)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedTerms, disabled: submitting }}
          accessibilityLabel="I agree to the Terms of Service and Privacy Policy"
          className="flex-row items-start gap-2 active:opacity-70"
          disabled={submitting}
        >
          <View
            className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
              acceptedTerms
                ? 'border-primary-600 bg-primary-600'
                : 'border-surface-border bg-white'
            }`}
          >
            {acceptedTerms ? (
              <Check size={14} color={palette.white} />
            ) : null}
          </View>
          <Text className="flex-1 text-sm text-ink-muted">
            I agree to the Terms of Service and Privacy Policy.
          </Text>
        </Pressable>

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
          Create account
        </Button>

        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-sm text-ink-subtle">Already have an account?</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.replace(ROUTES.signIn)}
          >
            Log in
          </Button>
        </View>
      </Card>
    </View>
  );
}
