import { useEffect, useState } from 'react';
import { Animated, Text, View, type DimensionValue } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { Button } from './Button';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
}

export function Skeleton({ width = '100%', height = 120 }: SkeletonProps) {
  const reducedMotion = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reducedMotion) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity, reducedMotion]);

  return (
    <Animated.View
      accessibilityLabel="Loading"
      className="rounded-card bg-surface-muted"
      style={{ width, height, opacity: reducedMotion ? 1 : opacity }}
    />
  );
}

export interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({
  message = "We couldn't load this content.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="items-center justify-center gap-3 rounded-card border border-surface-border bg-white px-5 py-10">
      <View className="items-center">
        <Text className="text-base font-semibold text-ink">
          Something went wrong
        </Text>
        <Text className="mt-1 text-center text-sm text-ink-subtle">
          {message}
        </Text>
      </View>
      <Button variant="secondary" size="sm" onPress={onRetry}>
        Try again
      </Button>
    </View>
  );
}
