import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Megaphone } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { SplashScreen } from 'expo-router';
import { BRAND } from '../../constants/brand';

function animateTiming(
  sharedValue: SharedValue<number>,
  target: number,
  duration: number
): void {
  sharedValue.value = withTiming(target, { duration });
}

function animateSpring(sharedValue: SharedValue<number>, target: number): void {
  sharedValue.value = withSpring(target, { damping: 12 });
}

export function AnimatedSplash({
  ready,
  onDone,
}: {
  ready: boolean;
  onDone: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const readyRef = useRef(ready);
  const onDoneRef = useRef(onDone);
  const tryFinishRef = useRef<() => void>(() => {});
  const scale = useSharedValue(reducedMotion ? 1 : 0.6);
  const logoOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const wordmarkOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const wordmarkY = useSharedValue(reducedMotion ? 0 : 10);
  const taglineOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const splashOpacity = useSharedValue(1);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: scale.value }],
  }));
  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateY: wordmarkY.value }],
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));
  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  useEffect(() => {
    readyRef.current = ready;
    onDoneRef.current = onDone;
  }, [onDone, ready]);

  useEffect(() => {
    void SplashScreen.hideAsync();

    const mountedAt = Date.now();
    const minimumDuration = reducedMotion ? 700 : 1600;
    let finishing = false;

    const tryFinish = () => {
      if (
        finishing ||
        !readyRef.current ||
        Date.now() - mountedAt < minimumDuration
      ) {
        return;
      }
      finishing = true;

      if (reducedMotion) {
        onDoneRef.current();
        return;
      }

      animateTiming(splashOpacity, 0, 200);
      setTimeout(() => onDoneRef.current(), 200);
    };
    tryFinishRef.current = tryFinish;

    if (!reducedMotion) {
      animateTiming(logoOpacity, 1, 450);
      animateSpring(scale, 1);

      const wordmarkTimer = setTimeout(() => {
        animateTiming(wordmarkOpacity, 1, 400);
        animateTiming(wordmarkY, 0, 400);
      }, 150);
      const taglineTimer = setTimeout(() => {
        animateTiming(taglineOpacity, 1, 400);
      }, 450);

      const minimumTimer = setTimeout(tryFinish, minimumDuration);
      return () => {
        clearTimeout(wordmarkTimer);
        clearTimeout(taglineTimer);
        clearTimeout(minimumTimer);
      };
    }

    const minimumTimer = setTimeout(tryFinish, minimumDuration);
    return () => clearTimeout(minimumTimer);
  }, [
    logoOpacity,
    reducedMotion,
    scale,
    splashOpacity,
    taglineOpacity,
    wordmarkOpacity,
    wordmarkY,
  ]);

  useEffect(() => {
    tryFinishRef.current();
  }, [ready]);

  return (
    <Animated.View
      className="flex-1 items-center justify-center bg-sidebar"
      style={splashStyle}
    >
      <View className="items-center">
        <Animated.View
          className="h-[72px] w-[72px] items-center justify-center rounded-2xl bg-primary-600"
          style={logoStyle}
        >
          <Megaphone size={36} color="#FFFFFF" />
        </Animated.View>
        <Animated.Text
          className="mt-5 text-4xl font-bold tracking-[2px] text-white"
          style={wordmarkStyle}
        >
          {BRAND.name}
        </Animated.Text>
        <Animated.Text
          className="mt-2 text-sm text-slate-400"
          style={taglineStyle}
        >
          {BRAND.tagline}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}
