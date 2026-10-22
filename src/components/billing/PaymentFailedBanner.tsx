import { Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Button } from '../ui/Button';
import { useManageBilling } from '../../hooks/useManageBilling';
import { colors } from '../../lib/theme';

/**
 * Shown whenever Stripe reports `past_due` (a renewal payment failed). It stays
 * until the payment method is fixed in the Billing Portal — dismissing it would
 * hide the only thing the user must act on.
 */
export function PaymentFailedBanner() {
  const { manageBilling, isOpening, error } = useManageBilling();

  return (
    <View className="rounded-card border border-danger-soft bg-danger-soft p-4">
      <View className="flex-row items-start gap-3">
        <View className="mt-0.5">
          <AlertTriangle size={18} color={colors.danger.DEFAULT} />
        </View>
        <View className="flex-1 gap-3">
          <Text className="text-sm text-ink">
            Your last payment failed. Update your payment method to keep your
            plan.
          </Text>
          <Button
            variant="danger"
            size="sm"
            loading={isOpening}
            onPress={() => void manageBilling()}
            className="self-start"
          >
            Update payment method
          </Button>
          {error ? <Text className="text-xs text-danger">{error}</Text> : null}
        </View>
      </View>
    </View>
  );
}
