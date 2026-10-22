import { Text, View } from 'react-native';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Layout override, e.g. tighter padding when nested in a fixed-height card. */
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn('items-center justify-center px-5 py-12', className)}>
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
