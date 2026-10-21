import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Button } from '../ui/Button';

export function LegalPlaceholder({ title }: { title: string }) {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-surface-page px-6">
      <View className="w-full max-w-lg gap-6">
        <Button
          variant="ghost"
          className="self-start"
          leftIcon={<ArrowLeft size={16} color="#64748B" />}
          onPress={() => router.back()}
        >
          Back
        </Button>
        <Text className="text-3xl font-bold text-ink">{title}</Text>
        <Text className="text-sm text-ink-subtle">
          This document will be published before launch.
        </Text>
      </View>
    </View>
  );
}
