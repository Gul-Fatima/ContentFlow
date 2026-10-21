import { Palette } from 'lucide-react-native';
import { Text, View, useWindowDimensions } from 'react-native';
import { Card } from '../ui/Card';
import { GOAL_OPTIONS } from '../../constants/onboardingGoals';
import type { GoalId } from '../../services/brand/types';
import { GoalOption } from './GoalOption';

export function PrimaryGoalsStep({
  value,
  onChange,
}: {
  value: GoalId[];
  onChange: (value: GoalId[]) => void;
}) {
  const { width } = useWindowDimensions();
  const columns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;

  const toggleGoal = (goal: GoalId) => {
    onChange(
      value.includes(goal)
        ? value.filter((item) => item !== goal)
        : [...value, goal]
    );
  };

  return (
    <Card padding="none" className="mt-7 gap-4 p-5">
      <View className="flex-row items-center gap-2">
        <Palette size={16} color="#4F46E5" />
        <Text className="text-sm font-semibold text-ink">Primary Goals</Text>
      </View>
      <Text className="text-xs text-ink-subtle">
        Select the goals most important to your brand (optional)
      </Text>
      <View
        className="flex-row flex-wrap"
        style={{ marginHorizontal: -6, marginBottom: -12 }}
      >
        {GOAL_OPTIONS.map((option) => (
          <View
            key={option.id}
            style={{
              width: `${100 / columns}%`,
              paddingHorizontal: 6,
              marginBottom: 12,
            }}
          >
            <GoalOption
              option={option}
              selected={value.includes(option.id)}
              onPress={() => toggleGoal(option.id)}
            />
          </View>
        ))}
      </View>
    </Card>
  );
}
