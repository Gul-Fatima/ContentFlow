import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { Screen } from '../../../src/components/layout/Screen';
import { ROUTES } from '../../../src/constants/routes';
import { colors } from '../../../src/lib/theme';

/**
 * Stripe sends the customer here when they close Checkout.
 * Nothing was charged and no subscription exists, so there is nothing to
 * confirm — no backend call is needed.
 */
export default function BillingCancelScreen() {
  const router = useRouter();

  return (
    <Screen
      title="Billing"
      scroll={false}
      contentClassName="flex-1 items-center justify-center p-4"
    >
      <Card className="w-full items-center p-6" style={{ maxWidth: 440 }}>
        <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
          <X size={28} color={colors.ink.faint} strokeWidth={3} />
        </View>
        <Text className="mb-2 text-center text-2xl font-bold text-ink">
          Checkout canceled
        </Text>
        <Text className="mb-6 text-center text-sm text-ink-subtle">
          No payment was made. You can choose a plan whenever you&apos;re ready.
        </Text>
        <Button
          variant="primary"
          fullWidth
          onPress={() => router.navigate(ROUTES.pricing)}
        >
          Back to pricing
        </Button>
        <Button
          variant="ghost"
          fullWidth
          className="mt-2"
          onPress={() => router.navigate(ROUTES.dashboard)}
        >
          Go to dashboard
        </Button>
      </Card>
    </Screen>
  );
}
