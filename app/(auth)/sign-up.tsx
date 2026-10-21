import { useState } from 'react';
import { Link, router } from 'expo-router';
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
const MIN_PASSWORD_LENGTH = 8;

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleNotice, setGoogleNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const fieldErrors = {
    name:
      touched.name || submitAttempted
        ? name.trim().length < 2
          ? 'Enter your full name.'
          : undefined
        : undefined,
    email:
      touched.email || submitAttempted
        ? !EMAIL_PATTERN.test(email.trim())
          ? 'Enter a valid email address.'
          : undefined
        : undefined,
    password:
      touched.password || submitAttempted
        ? password.length < MIN_PASSWORD_LENGTH
          ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
          : undefined
        : undefined,
    confirmPassword:
      touched.confirmPassword || submitAttempted
        ? !confirmPassword || password !== confirmPassword
          ? 'Passwords do not match.'
          : undefined
        : undefined,
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitAttempted(true);
    setError(null);

    if (
      name.trim().length < 2 ||
      !EMAIL_PATTERN.test(email.trim()) ||
      password.length < MIN_PASSWORD_LENGTH ||
      password !== confirmPassword
    ) {
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept the terms to continue.');
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
    <AuthShell
      topRight={
        <Pressable
          onPress={() => router.replace(ROUTES.signIn)}
          accessibilityRole="link"
          className="rounded-sm px-1 py-2 focus:ring-2 focus:ring-primary-500"
        >
          <Text className="text-sm font-semibold text-primary-600">
            Sign in
          </Text>
        </Pressable>
      }
    >
      <View className="gap-4">
        <Text className="mb-2 text-2xl font-bold text-ink">
          Create your account
        </Text>

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
          <View className="gap-1.5">
            <Input
              label="Full Name"
              value={name}
              onChangeText={(value) => {
                setName(value);
                setError(null);
              }}
              onBlur={() => setTouched((value) => ({ ...value, name: true }))}
              error={fieldErrors.name}
              placeholder="e.g. Alex Morgan"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              editable={!submitting}
              className="h-11 text-base"
            />
            <Text className="text-caption text-ink-faint">
              This is how your name will appear on your profile
            </Text>
          </View>

          <View className="gap-1.5">
            <Input
              label="Email Address"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError(null);
              }}
              onBlur={() => setTouched((value) => ({ ...value, email: true }))}
              error={fieldErrors.email}
              placeholder="alex@company.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
              editable={!submitting}
              className="h-11 text-base"
            />
            <Text className="text-caption text-ink-faint">
              We&apos;ll use this email to sign you in
            </Text>
          </View>

          <View className="gap-1.5">
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
              error={fieldErrors.password}
              placeholder="Create a strong password"
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
              editable={!submitting}
              className="h-11 text-base"
            />
            <Text className="text-caption text-ink-faint">
              At least 8 characters
            </Text>
          </View>

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setError(null);
            }}
            onBlur={() =>
              setTouched((value) => ({ ...value, confirmPassword: true }))
            }
            error={fieldErrors.confirmPassword}
            placeholder="Re-enter your password"
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            editable={!submitting}
            className="h-11 text-base"
          />
        </View>

        <View className="flex-row flex-wrap items-center gap-y-1">
          <Checkbox
            checked={acceptedTerms}
            onChange={(checked) => {
              setAcceptedTerms(checked);
              setError(null);
            }}
            disabled={submitting}
            accessibilityLabel="I agree to the Terms of Service and Privacy Policy"
          >
            I agree to the
          </Checkbox>
          <Link href={ROUTES.terms} asChild>
            <Pressable
              accessibilityRole="link"
              className="rounded-sm px-1 focus:ring-2 focus:ring-primary-500"
            >
              <Text className="text-sm font-medium text-primary-600">
                Terms of Service
              </Text>
            </Pressable>
          </Link>
          <Text className="text-sm text-ink-muted">and</Text>
          <Link href={ROUTES.privacy} asChild>
            <Pressable
              accessibilityRole="link"
              className="rounded-sm px-1 focus:ring-2 focus:ring-primary-500"
            >
              <Text className="text-sm font-medium text-primary-600">
                Privacy Policy
              </Text>
            </Pressable>
          </Link>
          <Text className="text-sm text-ink-muted">.</Text>
          {submitAttempted && !acceptedTerms ? (
            <Text className="mt-1 text-xs text-danger-text">
              Please accept the terms to continue.
            </Text>
          ) : null}
        </View>

        {error && acceptedTerms ? <FormError>{error}</FormError> : null}
        {error && !acceptedTerms && submitAttempted ? (
          <FormError>{error}</FormError>
        ) : null}

        <Button
          size="lg"
          fullWidth
          loading={submitting}
          onPress={handleSubmit}
          rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
        >
          Create Account
        </Button>

        <View className="mt-2 flex-row items-center justify-center gap-1">
          <Text className="text-sm text-ink-subtle">
            Already have an account?
          </Text>
          <Pressable
            onPress={() => router.replace(ROUTES.signIn)}
            accessibilityRole="link"
            className="rounded-sm px-1 py-2 focus:ring-2 focus:ring-primary-500"
          >
            <Text className="text-sm font-semibold text-primary-600">
              Sign in
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthShell>
  );
}
