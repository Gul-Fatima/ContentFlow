import { Check } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import type { GoalId } from '../../services/brand/types';
import { colors } from '../../lib/theme';

export interface GoalOptionData {
  id: GoalId;
  label: string;
  emoji: string;
}

export function GoalOption({
  option,
  selected,
  onPress,
}: {
  option: GoalOptionData;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={option.label}
      accessibilityState={{ checked: selected }}
      className={`min-h-12 flex-row items-center gap-2 rounded-control border px-3 py-2 focus:ring-2 focus:ring-primary-500 ${
        selected
          ? 'border-primary-500 bg-primary-50'
          : 'border-surface-border bg-white active:bg-surface-muted'
      }`}
    >
      <Text className="text-base">{option.emoji}</Text>
      <Text className="flex-1 text-sm text-ink">{option.label}</Text>
      {selected ? (
        <Check size={16} color={colors.primary[600]} />
      ) : null}
    </Pressable>
  );
}
