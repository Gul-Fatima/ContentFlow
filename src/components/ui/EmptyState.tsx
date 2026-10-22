import { Text, View } from 'react-native';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-5 py-12">
      <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-surface-muted">
        {icon}
      </View>
      <Text className="text-center text-base font-semibold text-ink">
        {title}
      </Text>
      {description ? (
        <Text className="mt-2 max-w-[320px] text-center text-sm text-ink-subtle">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          variant="secondary"
          size="sm"
          onPress={onAction}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}
