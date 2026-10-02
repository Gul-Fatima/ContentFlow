import { Drawer } from 'expo-router/drawer';
import { Sidebar } from '../../src/components/layout/Sidebar';

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <Sidebar navigation={props.navigation} />}
      screenOptions={{
        // The app renders its own Header inside each screen.
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.4)',
        swipeEdgeWidth: 60,
      }}
    />
  );
}
