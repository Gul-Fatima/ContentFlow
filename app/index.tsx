import { useState } from 'react';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { AnimatedSplash } from '../src/components/brand/AnimatedSplash';
import { ROUTES } from '../src/constants/routes';
import { useAuth } from '../src/providers/AuthProvider';

let splashShown = false;

export default function GateScreen() {
  const { status } = useAuth();
  const [animationDone, setAnimationDone] = useState(splashShown);

  if (splashShown || animationDone) {
    if (status === 'loading') {
      return <View className="flex-1 bg-sidebar" />;
    }
    return (
      <Redirect
        href={status === 'authenticated' ? ROUTES.dashboard : ROUTES.welcome}
      />
    );
  }

  return (
    <AnimatedSplash
      ready={status !== 'loading'}
      onDone={() => {
        splashShown = true;
        setAnimationDone(true);
      }}
    />
  );
}
