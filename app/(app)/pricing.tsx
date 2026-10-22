import { useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building2,
  Check,
  ChevronLeft,
  Crown,
  Lock,
  Tag,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { ErrorState, Skeleton } from '../../src/components/ui/Skeleton';
import { Tabs } from '../../src/components/ui/Tabs';
import { FormError } from '../../src/components/auth/FormError';
import { Screen } from '../../src/components/layout/Screen';
import { PaymentFailedBanner } from '../../src/components/billing/PaymentFailedBanner';
import { ROUTES } from '../../src/constants/routes';
import { useAsync } from '../../src/hooks/useAsync';
import { useManageBilling } from '../../src/hooks/useManageBilling';
import { ApiError } from '../../src/lib/api';
import { formatCents } from '../../src/lib/format';
import { openCheckout } from '../../src/lib/openExternal';
import { hasActivePlan, hasBillingAccount } from '../../src/lib/subscription';
import { cn } from '../../src/lib/utils';
import { colors, iconColor } from '../../src/lib/theme';
import { useSubscription } from '../../src/providers/SubscriptionProvider';
import {
  billingErrorMessage,
  getPlans,
  startCheckout,
} from '../../src/services/billing/billingService';
import type { BillingInterval, Plan } from '../../src/services/billing/types';

const PLAN_ICONS: Record<string, { Icon: LucideIcon; tile: string; color: string }> = {
  starter: { Icon: Zap, tile: 'bg-surface-muted', color: colors.ink.DEFAULT },
  pro: { Icon: Crown, tile: 'bg-warning-soft', color: colors.warning.DEFAULT },
  enterprise: {
    Icon: Building2,
    tile: 'bg-primary-100',
    color: colors.primary[600],
  },
};

const BILLING_OPTIONS = [
  { key: 'month', label: 'Monthly' },
  { key: 'year', label: 'Yearly' },
];

/** "$29/month" or "$278.40/year" — the amount Stripe will charge. */
function chargeLabel(plan: Plan, interval: BillingInterval): string {
  return interval === 'year'
    ? `${formatCents(plan.yearlyCents)}/year`
    : `${formatCents(plan.monthlyCents)}/month`;
}

export default function PricingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;
  const isMobile = width < 768;

  const { subscription, reload } = useSubscription();
  const { manageBilling, isOpening, error: portalError } = useManageBilling();

  const plansRequest = useAsync(getPlans, []);
  const plans = plansRequest.data;
  const loading = plansRequest.loading;
  const error =
    plansRequest.error instanceof ApiError
      ? plansRequest.error
      : plansRequest.error
        ? new ApiError(0, 'UNKNOWN', 'Could not load plans.')
        : null;

  const [interval, setInterval] = useState<BillingInterval>('month');
  const [reviewPlan, setReviewPlan] = useState<Plan | null>(null);

  const active = hasActivePlan(subscription);
  const billingAccount = hasBillingAccount(subscription);
  const pastDue = subscription?.status === 'past_due';

  const gridStyle = {
    width: '100%' as const,
    maxWidth: isWide ? 1100 : 480,
    alignSelf: 'center' as const,
    gap: isWide ? 24 : 16,
  };

  return (
    <Screen title="Pricing" contentClassName="gap-8 p-4 pb-16 md:p-8">
      {isMobile && (
        <Pressable
          onPress={() =>
            router.canGoBack() ? router.back() : router.navigate(ROUTES.dashboard)
          }
          accessibilityRole="button"
          accessibilityLabel="Back"
          className="flex-row items-center gap-1 self-start"
        >
          <ChevronLeft size={16} color={iconColor.subtle} />
          <Text className="text-sm text-ink-subtle">Back</Text>
        </Pressable>
      )}

      {pastDue && (
        <View style={{ width: '100%', maxWidth: 1100, alignSelf: 'center' }}>
          <PaymentFailedBanner />
        </View>
      )}

      {/* Header */}
      <View className="mx-auto w-full items-center" style={{ maxWidth: 672 }}>
        <Badge variant="primary" className="mb-4 bg-primary-100">
          <View className="flex-row items-center gap-1">
            <Tag size={12} color={iconColor.primary} />
            <Text className="text-xs font-medium text-primary-700">Pricing</Text>
          </View>
        </Badge>
        <Text className="mb-3 text-center text-2xl font-bold text-ink md:text-3xl">
          Choose the right plan for your team
        </Text>
        <Text className="text-center text-base text-ink-subtle">
          Scale your social media presence with AI.
        </Text>
      </View>

      {/* Billing interval */}
      <View className="mt-0 flex-row flex-wrap items-center justify-center gap-2">
        <Tabs
          items={BILLING_OPTIONS}
          value={interval}
          onChange={(key) => setInterval(key === 'year' ? 'year' : 'month')}
        />
        <Badge variant="success">Save 20%</Badge>
      </View>

      {/* Cards */}
      {loading ? (
        <View
          className={isWide ? 'flex-row items-stretch' : 'flex-col items-center'}
          style={gridStyle}
        >
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={isWide ? { flex: 1 } : { width: '100%' }}
            >
              <Skeleton height={480} />
            </View>
          ))}
        </View>
      ) : error ? (
        <View style={{ width: '100%', maxWidth: 480, alignSelf: 'center' }}>
          <ErrorState
            message="We couldn't load the plans. Check your connection and try again."
            onRetry={plansRequest.reload}
          />
        </View>
      ) : (
        <View
          className={isWide ? 'flex-row items-stretch' : 'flex-col items-center'}
          style={gridStyle}
        >
          {(plans ?? []).map((plan) => {
            const isCurrent = subscription?.plan === plan.id;
            const icon = PLAN_ICONS[plan.id] ?? PLAN_ICONS.starter;
            const Icon = icon.Icon;

            const cta = isCurrent
              ? 'current'
              : active
                ? 'switch'
                : 'upgrade';

            return (
              <View
                key={plan.id}
                style={isWide ? { flex: 1 } : { width: '100%' }}
              >
                <Card
                  padding="none"
                  className={cn(
                    'relative h-full flex-col overflow-hidden p-6',
                    plan.popular ? 'border-primary-500' : 'border-surface-border'
                  )}
                  style={
                    plan.popular
                      ? { borderWidth: 2, borderColor: colors.primary[500] }
                      : undefined
                  }
                >
                  {plan.popular && (
                    <View className="absolute right-4 top-4">
                      <Badge variant="primary">Most popular</Badge>
                    </View>
                  )}

                  <View className="mb-3 flex-row items-center gap-3 pr-20">
                    <View
                      className={cn(
                        'h-10 w-10 items-center justify-center rounded-lg',
                        icon.tile
                      )}
                    >
                      <Icon size={20} color={icon.color} />
                    </View>
                    <Text className="text-lg font-semibold text-ink">
                      {plan.name}
                    </Text>
                  </View>

                  <Text
                    className="mb-6 text-sm text-ink-subtle"
                    style={isWide ? { minHeight: 40 } : undefined}
                  >
                    {plan.tagline}
                  </Text>

                  <View className="mb-6">
                    <View className="flex-row items-baseline gap-1">
                      <Text className="text-4xl font-bold text-ink">
                        {interval === 'year'
                          ? formatCents(Math.round(plan.yearlyCents / 12))
                          : formatCents(plan.monthlyCents)}
                      </Text>
                      <Text className="text-sm text-ink-subtle">/month</Text>
                    </View>
                    {interval === 'year' && (
                      <Text className="mt-1 text-xs text-ink-subtle">
                        Billed {formatCents(plan.yearlyCents)}/year
                      </Text>
                    )}
                  </View>

                  <View className="mb-6 flex-1" style={{ gap: 10 }}>
                    {plan.features.map((feature) => (
                      <View
                        key={feature.label}
                        className="flex-row items-start gap-2.5"
                        accessibilityLabel={
                          feature.included
                            ? feature.label
                            : `Not included: ${feature.label}`
                        }
                      >
                        <View
                          className={cn(
                            'mt-0.5 h-[18px] w-[18px] items-center justify-center rounded-full',
                            feature.included
                              ? 'bg-success-soft'
                              : 'bg-surface-muted'
                          )}
                        >
                          <Check
                            size={11}
                            strokeWidth={3}
                            color={
                              feature.included
                                ? iconColor.success
                                : colors.ink.faint
                            }
                          />
                        </View>
                        <Text
                          className={cn(
                            'flex-1 text-sm',
                            feature.included ? 'text-ink' : 'text-ink-faint'
                          )}
                        >
                          {feature.label}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <Button
                    fullWidth
                    className="mt-auto"
                    variant={
                      cta === 'upgrade' && plan.id === 'pro'
                        ? 'primary'
                        : 'secondary'
                    }
                    disabled={cta === 'current'}
                    leftIcon={
                      cta === 'current' ? (
                        <Check size={16} color={iconColor.subtle} />
                      ) : undefined
                    }
                    loading={cta === 'switch' && isOpening}
                    onPress={() => {
                      if (cta === 'current') return;
                      if (cta === 'switch') {
                        void manageBilling();
                        return;
                      }
                      setReviewPlan(plan);
                    }}
                  >
                    {cta === 'current'
                      ? 'Current plan'
                      : cta === 'switch'
                        ? `Switch to ${plan.name}`
                        : `Upgrade to ${plan.name}`}
                  </Button>
                </Card>
              </View>
            );
          })}
        </View>
      )}

      {/* Footnote */}
      <View className="items-center gap-2">
        <Text className="text-center text-xs text-ink-subtle">
          Prices in USD. Taxes may apply. Cancel anytime from Manage billing.
        </Text>
        {billingAccount && (
          <Pressable
            onPress={() => void manageBilling()}
            accessibilityRole="button"
            accessibilityLabel="Manage billing"
            disabled={isOpening}
          >
            <Text className="text-xs font-semibold text-primary-700">
              Manage billing
            </Text>
          </Pressable>
        )}
        {portalError ? (
          <Text className="text-center text-xs text-danger">{portalError}</Text>
        ) : null}
      </View>

      {reviewPlan && (
        <ReviewPlanModal
          key={`${reviewPlan.id}-${interval}`}
          plan={reviewPlan}
          interval={interval}
          onClose={() => setReviewPlan(null)}
          onSubscriptionChanged={() => void reload()}
        />
      )}
    </Screen>
  );
}

/**
 * The Review step. It explains that payment happens on Stripe, then hands the
 * customer to Stripe Checkout — this screen never claims a payment succeeded.
 */
function ReviewPlanModal({
  plan,
  interval,
  onClose,
  onSubscriptionChanged,
}: {
  plan: Plan;
  interval: BillingInterval;
  onClose: () => void;
  onSubscriptionChanged: () => void;
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [starting, setStarting] = useState(false);
  const [failure, setFailure] = useState<{
    message: string;
    canManage: boolean;
  } | null>(null);
  const { manageBilling, isOpening } = useManageBilling();

  const handleContinue = async () => {
    if (starting) return;
    setStarting(true);
    setFailure(null);
    try {
      const { url } = await startCheckout({ plan: plan.id, interval });
      await openCheckout(url);
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === 'ALREADY_SUBSCRIBED') {
        setFailure({ message: 'You already have an active plan.', canManage: true });
        onSubscriptionChanged();
      } else {
        setFailure({ message: billingErrorMessage(caught), canManage: false });
      }
    } finally {
      setStarting(false);
    }
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className={cn(
          'flex-1 bg-black/40',
          isWide ? 'items-center justify-center p-6' : 'justify-end'
        )}
      >
        <Pressable
          className="absolute inset-0"
          accessibilityRole="button"
          accessibilityLabel="Close review"
          onPress={onClose}
        />

        <View
          className={cn(
            'w-full bg-white p-6',
            isWide ? 'rounded-card' : 'rounded-t-2xl'
          )}
          style={isWide ? { maxWidth: 420 } : undefined}
        >
          <View className="mb-5 flex-row items-center justify-between gap-3">
            <Text className="flex-1 text-lg font-semibold text-ink">
              Review your plan
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              className="h-8 w-8 items-center justify-center rounded-full active:bg-surface-muted"
            >
              <X size={18} color={iconColor.subtle} />
            </Pressable>
          </View>

          <View className="gap-3">
            <ReviewRow label="Plan" value={plan.name} />
            <ReviewRow
              label="Billing"
              value={interval === 'year' ? 'Yearly' : 'Monthly'}
            />
            <ReviewRow label="Price" value={chargeLabel(plan, interval)} />
          </View>

          <View className="my-5 h-px bg-surface-border" />

          <View className="mb-5 flex-row items-start gap-2">
            <View className="mt-0.5">
              <Lock size={12} color={colors.ink.subtle} />
            </View>
            <Text className="flex-1 text-xs text-ink-subtle">
              You&apos;ll enter your payment details on Stripe&apos;s secure
              checkout. IBDA never sees or stores your card.
            </Text>
          </View>

          {failure ? (
            <View className="mb-4 gap-2">
              <FormError>{failure.message}</FormError>
              {failure.canManage ? (
                <Button
                  variant="secondary"
                  size="sm"
                  loading={isOpening}
                  onPress={() => void manageBilling()}
                  className="self-start"
                >
                  Manage billing
                </Button>
              ) : null}
            </View>
          ) : null}

          <View className="flex-row gap-3">
            <Button
              variant="ghost"
              onPress={onClose}
              disabled={starting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={() => void handleContinue()}
              loading={starting}
              className="flex-1"
            >
              {starting ? 'Redirecting...' : 'Continue to payment'}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text className="text-sm text-ink-subtle">{label}</Text>
      <Text className="text-sm font-semibold text-ink">{value}</Text>
    </View>
  );
}
