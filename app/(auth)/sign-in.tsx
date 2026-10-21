import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { AuthDivider } from '../../src/components/auth/AuthDivider';
import { AuthShell } from '../../src/components/auth/AuthShell';
import { Checkbox } from '../../src/components/auth/Checkbox';
import { FormError, FormNotice } from '../../src/components/auth/FormError';
import { GoogleButton } from '../../src/components/auth/GoogleButton';
import { PasswordInput } from '../../src/components/auth/PasswordInput';
import { Button } from '../../src/components/ui/Button';
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
  const [googleNotice, setGoogleNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError =
    touched.email || submitAttempted
      ? !EMAIL_PATTERN.test(email.trim())
        ? 'Enter a valid email address.'
        : undefined
      : undefined;
  const passwordError =
    touched.password || submitAttempted
      ? !password
        ? 'Enter your password.'
        : undefined
      : undefined;

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitAttempted(true);
    setError(null);

    if (!EMAIL_PATTERN.test(email.trim())) return;
    if (!password) return;

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
    <AuthShell
      topRight={
        <Pressable
          onPress={() => router.replace(ROUTES.signUp)}
          accessibilityRole="link"
          className="rounded-sm px-1 py-2 focus:ring-2 focus:ring-primary-500"
        >
          <Text className="text-sm font-semibold text-primary-600">Sign up</Text>
        </Pressable>
      }
    >
      <View className="gap-4">
        <View className="gap-2">
          <Text className="text-2xl font-bold text-ink">Welcome back</Text>
          <Text className="text-sm text-ink-subtle">
            Sign in to continue managing your social presence.
          </Text>
        </View>

        {AUTH_IS_DEMO ? (
          <FormNotice>
            Demo mode: accounts are stored on this device only.
          </FormNotice>
        ) : null}

        {googleNotice ? (
          <FormNotice>
            Google sign-in isn&apos;t available yet. Use email and password.
          </FormNotice>
        ) : null}

        <GoogleButton onPress={() => setGoogleNotice(true)} />
        <AuthDivider />

        <View className="gap-4">
          <Input
            label="Email Address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError(null);
            }}
            onBlur={() => setTouched((value) => ({ ...value, email: true }))}
            error={emailError}
            placeholder="alex@company.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
            editable={!submitting}
            className="h-11 text-base"
          />

          <PasswordInput
            label="Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setError(null);
            }}
            onBlur={() =>
              setTouched((value) => ({ ...value, password: true }))
            }
            error={passwordError}
            placeholder="Enter your password"
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            editable={!submitting}
            className="h-11 text-base"
          />
        </View>

        <View className="flex-row items-center justify-between">
          <Checkbox
            checked={remember}
            onChange={setRemember}
            disabled={submitting}
          >
            Remember me
          </Checkbox>
          <Pressable
            onPress={() => router.push(ROUTES.forgotPassword)}
            accessibilityRole="link"
            className="rounded-sm px-1 py-2 focus:ring-2 focus:ring-primary-500"
          >
            <Text className="text-sm font-medium text-primary-600">
              Forgot password?
            </Text>
          </Pressable>
        </View>

        {error ? <FormError>{error}</FormError> : null}

        <Button
          size="lg"
          fullWidth
          loading={submitting}
          onPress={handleSubmit}
          rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
        >
          Sign In
        </Button>

        <View className="mt-2 flex-row items-center justify-center gap-1">
          <Text className="text-sm text-ink-subtle">
            Don&apos;t have an account?
          </Text>
          <Pressable
            onPress={() => router.replace(ROUTES.signUp)}
            accessibilityRole="link"
            className="rounded-sm px-1 py-2 focus:ring-2 focus:ring-primary-500"
          >
            <Text className="text-sm font-semibold text-primary-600">
              Sign up free
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthShell>
  );
}
