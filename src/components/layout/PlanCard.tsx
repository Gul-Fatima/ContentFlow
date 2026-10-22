import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Crown, Sparkles } from 'lucide-react-native';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { ROUTES } from '../../constants/routes';
import { useSubscription } from '../../providers/SubscriptionProvider';
import { useManageBilling } from '../../hooks/useManageBilling';
import {
  planName,
  renewalLabel,
  statusPill,
  usagePercent,
} from '../../lib/subscription';
import { formatLimit } from '../../lib/format';
import { colors } from '../../lib/theme';

type PlanCardVariant = 'sidebar' | 'compact';

/**
 * The plan card from the Figma sidebar, driven entirely by
 * `GET /api/billing/subscription`. Never shows a hardcoded "Pro Plan":
 * a signed-out/unconfigured state is either a skeleton, an error with retry,
 * or "No active plan".
 *
 * `compact` is the one-line version used in the profile menu.
 */
export function PlanCard({
  variant = 'sidebar',
  onNavigate,
}: {
  variant?: PlanCardVariant;
  /** Closes the hosting menu/drawer before navigating. */
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const { subscription, loading, error, reload } = useSubscription();
  const { manageBilling, isOpening } = useManageBilling();

  const go = (route: typeof ROUTES.pricing) => {
    onNavigate?.();
    router.navigate(route);
  };

  // Only `plan === 'none'` means "never subscribed"; a past-due or cancelling
  // subscription still has a plan and keeps its card (with a status pill).
  const hasPlan = (subscription?.plan ?? 'none') !== 'none';
  const pill = statusPill(subscription);
  const name = planName(subscription?.plan);

  if (variant === 'compact') {
    return (
      <View className="mb-1 rounded-md bg-surface-muted px-3 py-2">
        {loading ? (
          <Text className="text-xs text-ink-subtle">Loading plan…</Text>
        ) : error ? (
          <Pressable onPress={() => reload()} accessibilityRole="button">
            <Text className="text-xs text-ink-subtle">
              Couldn&apos;t load plan ·{' '}
              <Text className="font-semibold text-primary-700">Retry</Text>
            </Text>
          </Pressable>
        ) : (
          <View className="flex-row items-center justify-between gap-2">
            <Text className="text-xs font-medium text-ink">
              {hasPlan ? `${name} Plan` : 'No active plan'}
            </Text>
            {pill ? (
              <Badge variant={pill.tone}>{pill.label}</Badge>
            ) : null}
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      className="rounded-2xl border bg-sidebar-card p-4"
      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {loading ? (
        <View accessibilityLabel="Loading plan">
          <Skeleton height={72} />
        </View>
      ) : error ? (
        <View className="items-start">
          <Text className="text-xs text-ink-faint">Couldn&apos;t load plan</Text>
          <Pressable
            onPress={() => reload()}
            accessibilityRole="button"
            accessibilityLabel="Retry loading plan"
            className="mt-1"
          >
            <Text className="text-xs font-semibold text-primary-300">Retry</Text>
          </Pressable>
        </View>
      ) : !hasPlan ? (
        <>
          <View className="mb-3 flex-row items-center gap-2">
            <View className="h-6 w-6 items-center justify-center rounded-md bg-sidebar-track">
              <Crown size={12} color={colors.ink.faint} />
            </View>
            <Text className="text-sm font-semibold text-white">
              No active plan
            </Text>
          </View>
          <Text className="mb-4 text-xs text-ink-faint">
            Choose a plan to unlock AI content generation.
          </Text>
          <Button
            variant="primary"
            fullWidth
            className="h-10"
            leftIcon={<Sparkles size={14} color={colors.surface.card} />}
            onPress={() => go(ROUTES.pricing)}
          >
            Choose a plan
          </Button>
        </>
      ) : (
        <>
          <View className="mb-3 flex-row items-center justify-between gap-2">
            <View className="flex-1 flex-row items-center gap-2">
              <View className="h-6 w-6 items-center justify-center rounded-md bg-orange-500">
                <Crown size={12} color={colors.surface.card} />
              </View>
              <Text
                className="flex-1 text-sm font-semibold text-white"
                numberOfLines={1}
              >
                {name} Plan
              </Text>
            </View>
            {pill ? (
              <Badge variant={pill.tone}>{pill.label}</Badge>
            ) : null}
          </View>

          <UsageRow
            label="Posts used"
            used={subscription?.usage.postsUsed ?? 0}
            limit={subscription?.usage.postsLimit ?? null}
          />
          <UsageRow
            label="AI credits"
            used={subscription?.usage.creditsUsed ?? 0}
            limit={subscription?.usage.creditsLimit ?? null}
            className="mb-4 mt-3"
          />

          <Button
            variant="primary"
            fullWidth
            className="h-10"
            loading={isOpening}
            leftIcon={<Sparkles size={14} color={colors.surface.card} />}
            onPress={() => {
              if (subscription?.plan === 'enterprise') {
                void manageBilling();
                return;
              }
              go(ROUTES.pricing);
            }}
          >
            {subscription?.plan === 'starter'
              ? 'Upgrade to Pro'
              : subscription?.plan === 'pro'
                ? 'Upgrade to Enterprise'
                : 'Manage billing'}
          </Button>

          {renewalLabel(subscription) ? (
            <Text className="mt-2 text-center text-caption text-ink-subtle">
              {renewalLabel(subscription)}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}

function UsageRow({
  label,
  used,
  limit,
  className,
}: {
  label: string;
  used: number;
  limit: number | null;
  className?: string;
}) {
  return (
    <View className={className}>
      <View className="flex-row justify-between">
        <Text className="text-xs text-ink-faint">{label}</Text>
        <Text className="text-xs text-white">
          {used.toLocaleString('en-US')} / {formatLimit(limit)}
        </Text>
      </View>
      <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-muted">
        <View
          className="h-full rounded-full"
          style={{
            width: `${usagePercent(used, limit)}%`,
            backgroundColor: colors.primary[500],
          }}
        />
      </View>
    </View>
  );
}
