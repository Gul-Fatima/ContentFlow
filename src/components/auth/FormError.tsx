import type { ReactNode } from 'react';
import { AlertCircle, Info } from 'lucide-react-native';
import { Text, View } from 'react-native';

function FormMessage({
  children,
  notice,
}: {
  children: ReactNode;
  notice: boolean;
}) {
  const Icon = notice ? Info : AlertCircle;

  return (
    <View
      className={`flex-row items-start gap-2 rounded-control p-3 ${
        notice ? 'bg-primary-50' : 'bg-danger-soft'
      }`}
      accessibilityLiveRegion="polite"
    >
      <Icon
        size={18}
        color={notice ? '#4338CA' : '#B91C1C'}
        style={{ marginTop: 1 }}
      />
      <Text
        className={`flex-1 text-sm ${
          notice ? 'text-primary-700' : 'text-danger-text'
        }`}
        accessibilityRole={notice ? undefined : 'alert'}
      >
        {children}
      </Text>
    </View>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  return <FormMessage notice={false}>{children}</FormMessage>;
}

export function FormNotice({ children }: { children: ReactNode }) {
  return <FormMessage notice>{children}</FormMessage>;
}
