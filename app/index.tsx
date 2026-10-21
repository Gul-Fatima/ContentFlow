import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { Logo } from '../src/components/brand/Logo';
import { ROUTES } from '../src/constants/routes';
import { useAuth } from '../src/providers/AuthProvider';

/**
 * Entry gate for "/". Holds the branded splash frame while the stored session
 * is read, then redirects. The animated splash lands in task B2.
 */
export default function GateScreen() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-sidebar">
        <Logo variant="onDark" />
      </View>
    );
  }

  return (
    <Redirect
      href={status === 'authenticated' ? ROUTES.dashboard : ROUTES.welcome}
    />
  );
}
