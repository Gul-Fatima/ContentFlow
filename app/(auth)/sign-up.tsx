import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '../../src/components/ui/Button';
import { ROUTES } from '../../src/constants/routes';

export default function SignUpScreen() {
  return (
    <View>
      <Text>Sign up</Text>
      <Button
        onPress={() => {
          // TODO: real auth
          router.replace(ROUTES.dashboard);
        }}
      >
        Create account
      </Button>
    </View>
  );
}
