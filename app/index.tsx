import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AnimatedSplash } from '../src/components/brand/AnimatedSplash';
import { Logo } from '../src/components/brand/Logo';
import { Button } from '../src/components/ui/Button';
import { FormError } from '../src/components/auth/FormError';
import { ROUTES, type AppRoute } from '../src/constants/routes';
import { useAuth } from '../src/providers/AuthProvider';
import { getPostAuthRoute } from '../src/services/onboarding/onboardingService';

let splashShown = false;

export default function GateScreen() {
  const { status, user } = useAuth();
  const [animationDone, setAnimationDone] = useState(splashShown);
  const [destination, setDestination] = useState<{
    userId: string;
    route: AppRoute;
  } | null>(null);
  const [failedUserId, setFailedUserId] = useState<string | null>(null);
  const [routeAttempt, setRouteAttempt] = useState(0);

  useEffect(() => {
    if (!animationDone || status !== 'authenticated' || !user) return;
    let active = true;

    getPostAuthRoute(user.id)
      .then((route) => {
        if (active) setDestination({ userId: user.id, route });
      })
      .catch((error: unknown) => {
        console.error('Unable to read onboarding state for the app gate.', error);
        if (active) setFailedUserId(user.id);
      });

    return () => {
      active = false;
    };
  }, [animationDone, routeAttempt, status, user]);

  if (splashShown || animationDone) {
    if (status === 'loading') {
      return (
        <View className="flex-1 items-center justify-center gap-4 bg-sidebar">
          <Logo variant="onDark" />
          <ActivityIndicator color="#FFFFFF" />
        </View>
      );
    }
    if (status === 'unauthenticated') {
      return <Redirect href={ROUTES.welcome} />;
    }
    if (!user || failedUserId === user.id) {
      return (
        <View className="flex-1 items-center justify-center bg-white px-6">
          <View className="w-full max-w-md gap-4">
            <FormError>
              We couldn’t load your onboarding progress. Please try again.
            </FormError>
            <Button
              variant="secondary"
              onPress={() => {
                setFailedUserId(null);
                setDestination(null);
                setRouteAttempt((attempt) => attempt + 1);
              }}
            >
              Try again
            </Button>
          </View>
        </View>
      );
    }
    const route =
      destination?.userId === user.id ? destination.route : null;
    return route ? (
      <Redirect href={route} />
    ) : (
      <View className="flex-1 items-center justify-center gap-4 bg-sidebar">
        <Logo variant="onDark" />
        <ActivityIndicator color="#FFFFFF" />
      </View>
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
