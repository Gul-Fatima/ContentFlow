import { Pressable, Text, View } from 'react-native';

export function GoogleButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="h-11 w-full flex-row items-center justify-center gap-2 rounded-control border border-surface-border bg-white active:bg-surface-muted"
    >
      <View className="h-5 w-5 items-center justify-center rounded-full border border-[#4285F4]">
        <Text className="text-sm font-bold text-[#4285F4]">G</Text>
      </View>
      <Text className="text-sm font-medium text-ink">
        Continue with Google
      </Text>
    </Pressable>
  );
}
