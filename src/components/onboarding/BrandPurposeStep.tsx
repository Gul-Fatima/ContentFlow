import { Target } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Card } from '../ui/Card';
import { Textarea } from '../ui/Textarea';

export function BrandPurposeStep({
  value,
  error,
  onChange,
  onBlur,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <Card padding="none" className="mt-7 gap-5 p-5">
      <View className="flex-row items-center gap-2">
        <Target size={16} color="#4F46E5" />
        <Text className="text-sm font-semibold text-ink">Brand Purpose</Text>
      </View>
      <View className="gap-2">
        <Textarea
          label="What does your brand do?"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error}
          placeholder="e.g. We help small businesses automate their social media marketing using AI, saving them time and growing their audience."
          className="min-h-40 text-base"
        />
        <Text className="text-caption text-ink-faint">
          This helps our AI write content that accurately represents your brand.
          Be as specific as possible.
        </Text>
        <Text
          className={`text-right text-caption ${
            value.length > 500 ? 'text-danger-text' : 'text-ink-faint'
          }`}
        >
          {value.length}/500
        </Text>
      </View>
    </Card>
  );
}
