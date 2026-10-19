import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { ROUTES } from '../src/constants/routes';

export default function NotFoundScreen() {
  return (
    <View>
      <Text>This screen does not exist.</Text>
      <Button onPress={() => router.replace(ROUTES.dashboard)}>
        Go to dashboard
      </Button>
    </View>
  );
}
