import { Text } from 'react-native';

export interface ResultCountProps {
  count: number;
  total: number;
  active: boolean;
}

export function ResultCount({ count, total, active }: ResultCountProps) {
  if (!active) return null;
  return (
    <Text
      accessibilityLiveRegion="polite"
      className="text-xs text-ink-subtle"
    >
      Showing {count} of {total}
    </Text>
  );
}
