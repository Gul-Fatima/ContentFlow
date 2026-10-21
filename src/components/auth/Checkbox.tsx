import type { ReactNode } from 'react';
import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { palette } from '../../lib/theme';

export function Checkbox({
  checked,
  onChange,
  children,
  disabled = false,
  accessibilityLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      className="flex-row items-center gap-2 active:opacity-70"
    >
      <View
        className={`h-[18px] w-[18px] items-center justify-center rounded border ${
          checked
            ? 'border-primary-600 bg-primary-600'
            : 'border-surface-border bg-white'
        }`}
      >
        {checked ? <Check size={12} color={palette.white} /> : null}
      </View>
      {typeof children === 'string' ? (
        <Text className="text-sm text-ink-muted">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
