import React from 'react';
import { View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '../../lib/utils';

interface GradientProps extends ViewProps {
  /** Gradient stops, e.g. `['#F7EAE0', '#FFFFFF']`. */
  colors: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  className?: string;
  children?: React.ReactNode;
}

/**
 * Rounded, clipped gradient container. NativeWind can't style `LinearGradient`
 * directly, so the className lives on an outer `View` that clips the fill.
 */
export function Gradient({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  className,
  children,
  style,
  ...props
}: GradientProps) {
  return (
    <View className={cn('overflow-hidden', className)} style={style} {...props}>
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={{ flexGrow: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
}
