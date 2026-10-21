import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { AuthShell } from '../../src/components/auth/AuthShell';
import { FormError, FormNotice } from '../../src/components/auth/FormError';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { ROUTES } from '../../src/constants/routes';
import { authErrorMessage, requestPasswordReset } from '../../src/services/auth/authService';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const emailError =
    touched || submitAttempted
      ? !EMAIL_PATTERN.test(email.trim())
        ? 'Enter a valid email address.'
        : undefined
      : undefined;

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitAttempted(true);
    setError(null);
    setNotice(null);
    if (!EMAIL_PATTERN.test(email.trim())) return;

    setSubmitting(true);
    try {
      const result = await requestPasswordReset(email.trim());
      if (result.sent) {
        setNotice(
          'If an account exists for that email, a reset link is on its way.'
        );
      } else if (result.demo) {
        setNotice('Demo mode: no email is sent.');
      } else {
        setError('Password reset could not be requested. Please try again later.');
      }
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  };

  const signInLink = (
    <Pressable
      onPress={() => router.replace(ROUTES.signIn)}
      accessibilityRole="link"
      className="rounded-sm px-1 py-2 focus:ring-2 focus:ring-primary-500"
    >
      <Text className="text-sm font-semibold text-primary-600">
        Back to sign in
      </Text>
    </Pressable>
  );

  return (
    <AuthShell topRight={signInLink}>
      <View className="gap-5">
        <View className="gap-2">
          <Text className="text-2xl font-bold text-ink">
            Reset your password
          </Text>
          <Text className="text-sm text-ink-subtle">
            Enter your email and we&apos;ll send you a reset link.
          </Text>
        </View>

        {notice ? <FormNotice>{notice}</FormNotice> : null}
        {error ? <FormError>{error}</FormError> : null}

        <Input
          label="Email Address"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setError(null);
            setNotice(null);
          }}
          onBlur={() => setTouched(true)}
          error={emailError}
          placeholder="alex@company.com"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!submitting}
          className="h-11 text-base"
        />

        <Button
          size="lg"
          fullWidth
          loading={submitting}
          onPress={handleSubmit}
        >
          Send reset link
        </Button>

        <View className="items-center">
          {signInLink}
        </View>
      </View>
    </AuthShell>
  );
}
