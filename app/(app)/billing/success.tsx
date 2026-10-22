import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Clock } from 'lucide-react-native';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { Screen } from '../../../src/components/layout/Screen';
import { ROUTES } from '../../../src/constants/routes';
import { formatDate } from '../../../src/lib/format';
import { planName } from '../../../src/lib/subscription';
import { colors, iconColor } from '../../../src/lib/theme';
import { useSubscription } from '../../../src/providers/SubscriptionProvider';
import {
  billingErrorMessage,
  getSubscription,
} from '../../../src/services/billing/billingService';
import type { Subscription } from '../../../src/services/billing/types';

/**
 * Where Stripe's success redirect lands.
 *
 * The `session_id` param is read for diagnostics only — it is NEVER treated as
 * proof of payment. Success is shown only when the backend reports an active
 * subscription (webhook or server-side Stripe lookup), polled for up to 30s.
 */
const POLL_INTERVAL_MS = 2_000;
const POLL_TIMEOUT_MS = 30_000;

type Phase = 'processing' | 'active' | 'unconfirmed' | 'error';

export default function BillingSuccessScreen() {
  const router = useRouter();
  const { session_id: sessionId } = useLocalSearchParams<{ session_id?: string }>();
  const { reload } = useSubscription();

  const [phase, setPhase] = useState<Phase>('processing');
  const [confirmed, setConfirmed] = useState<Subscription | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempt, setAttempt] = useState(0);
  // Bumped by the 2s timer so the effect below runs one more check. Keeping the
  // loop in state means every state update happens in an async callback.
  const [tick, setTick] = useState(0);
  // 0 until the first check starts; `restart` resets it so the 30s window is
  // measured from the newest attempt rather than from the first mount.
  const startedAtRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    if (startedAtRef.current === 0) startedAtRef.current = Date.now();

    getSubscription({ refresh: true })
      .then((next) => {
        if (cancelled) return;
        if (next.isActive) {
          setConfirmed(next);
          setPhase('active');
          // Every plan card in the shell reads the provider; refresh it too.
          void reload();
          return;
        }
        if (Date.now() - startedAtRef.current >= POLL_TIMEOUT_MS) {
          setPhase('unconfirmed');
          return;
        }
        setTimeout(() => {
          if (!cancelled) setTick((value) => value + 1);
        }, POLL_INTERVAL_MS);
      })
      .catch((caught) => {
        if (cancelled) return;
        setErrorMessage(billingErrorMessage(caught));
        setPhase('error');
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, tick, reload]);

  const restart = () => {
    startedAtRef.current = Date.now();
    setPhase('processing');
    setErrorMessage('');
    setAttempt((value) => value + 1);
  };

  const plan = planName(confirmed?.plan);
  const renewsOn = formatDate(confirmed?.currentPeriodEnd);
  const intervalLabel =
    confirmed?.interval === 'year'
      ? 'billed yearly'
      : confirmed?.interval === 'month'
        ? 'billed monthly'
        : '';

  return (
    <Screen
      title="Billing"
      scroll={false}
      contentClassName="flex-1 items-center justify-center p-4"
    >
      <Card className="w-full items-center p-6" style={{ maxWidth: 440 }}>
        {phase === 'processing' && (
          <>
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <ActivityIndicator color={iconColor.primary} />
            </View>
            <Text className="mb-2 text-center text-xl font-semibold text-ink">
              Confirming your payment...
            </Text>
            <Text className="text-center text-sm text-ink-subtle">
              This usually takes a few seconds. Please keep this screen open.
            </Text>
          </>
        )}

        {phase === 'active' && (
          <>
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-success-soft">
              <Check size={28} color={colors.success.DEFAULT} strokeWidth={3} />
            </View>
            <Text className="mb-2 text-center text-2xl font-bold text-ink">
              You&apos;re on the {plan} plan
            </Text>
            <Text className="mb-6 text-center text-sm text-ink-subtle">
              Your subscription is active.
              {renewsOn ? ` Renews on ${renewsOn}` : ''}
              {intervalLabel ? `, ${intervalLabel}.` : '.'}
            </Text>
            <Button
              variant="primary"
              fullWidth
              onPress={() => router.navigate(ROUTES.dashboard)}
            >
              Go to dashboard
            </Button>
            <Button
              variant="ghost"
              fullWidth
              className="mt-2"
              onPress={() =>
                router.navigate({
                  pathname: ROUTES.profile,
                  params: { tab: 'billing' },
                })
              }
            >
              View billing
            </Button>
            {sessionId ? (
              <Text className="mt-4 text-center text-caption text-ink-faint">
                Reference: {sessionId.slice(0, 24)}…
              </Text>
            ) : null}
          </>
        )}

        {phase === 'unconfirmed' && (
          <>
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-warning-soft">
              <Clock size={28} color={colors.warning.DEFAULT} />
            </View>
            <Text className="mb-2 text-center text-2xl font-bold text-ink">
              Still confirming...
            </Text>
            <Text className="mb-6 text-center text-sm text-ink-subtle">
              We haven&apos;t received confirmation from the payment provider
              yet. This can take a minute. You haven&apos;t lost anything, and
              you&apos;ll be notified once your plan is active.
            </Text>
            <Button variant="primary" fullWidth onPress={restart}>
              Check again
            </Button>
            <Button
              variant="ghost"
              fullWidth
              className="mt-2"
              onPress={() => router.navigate(ROUTES.pricing)}
            >
              Back to pricing
            </Button>
          </>
        )}

        {phase === 'error' && (
          <>
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-danger-soft">
              <Clock size={28} color={colors.danger.DEFAULT} />
            </View>
            <Text className="mb-2 text-center text-2xl font-bold text-ink">
              We couldn&apos;t confirm your payment
            </Text>
            <Text className="mb-6 text-center text-sm text-ink-subtle">
              {errorMessage}
            </Text>
            <Button variant="primary" fullWidth onPress={restart}>
              Try again
            </Button>
            <Button
              variant="ghost"
              fullWidth
              className="mt-2"
              onPress={() => router.navigate(ROUTES.pricing)}
            >
              Back to pricing
            </Button>
          </>
        )}
      </Card>
    </Screen>
  );
}
