import { Text, View } from 'react-native';

export function AuthDivider() {
  return (
    <View className="my-5 flex-row items-center">
      <View className="h-px flex-1 bg-surface-border" />
      <Text className="px-3 text-xs text-ink-faint">
        or continue with email
      </Text>
      <View className="h-px flex-1 bg-surface-border" />
    </View>
  );
}
