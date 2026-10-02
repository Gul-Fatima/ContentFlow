import React, { useEffect, useState } from 'react';
import { Animated, type ViewProps } from 'react-native';

interface FadeInProps extends ViewProps {
  /** Delay before the animation starts, in ms. */
  delay?: number;
  /** Distance in px the content travels while fading in. */
  offset?: number;
  /** Direction of the travel. `y` slides up, `x` slides in from the right. */
  axis?: 'x' | 'y';
  duration?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Drop-in replacement for the `motion.div` entry animations in the original
 * web app. Uses React Native's built-in `Animated` driver (no Reanimated
 * dependency), so it behaves identically on native and web.
 */
export function FadeIn({
  delay = 0,
  offset = 12,
  axis = 'y',
  duration = 300,
  className,
  children,
  style,
  ...props
}: FadeInProps) {
  // Held in state rather than a ref: the value is read during render (for the
  // interpolated style), and the `react-hooks/refs` rule forbids that.
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, duration, progress]);

  const translate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [offset, 0],
  });

  return (
    <Animated.View
      className={className}
      style={[
        {
          opacity: progress,
          transform: axis === 'y' ? [{ translateY: translate }] : [{ translateX: translate }],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
