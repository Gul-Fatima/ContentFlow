import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '../../src/components/ui/Button';
import { ROUTES } from '../../src/constants/routes';

export default function SignInScreen() {
  return (
    <View>
      <Text>Sign in</Text>
      <Button
        onPress={() => {
          // TODO: real auth
          router.replace(ROUTES.dashboard);
        }}
      >
        Sign in
      </Button>
    </View>
  );
}
