import { Drawer } from 'expo-router/drawer';
import { useWindowDimensions } from 'react-native';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { SidebarProvider, useSidebar } from '../../src/context/SidebarContext';

function AppDrawer() {
  const { width } = useWindowDimensions();
  const { collapsed } = useSidebar();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isPermanent = isTablet || isDesktop;
  const effectiveCollapsed = isPermanent ? collapsed : false;
  const drawerWidth = isMobile ? 280 : effectiveCollapsed ? 80 : 256;

  return (
    <Drawer
      drawerContent={(props) => (
        <Sidebar {...props} collapsed={effectiveCollapsed} />
      )}
      screenOptions={{
        headerShown: false,
        drawerType: isMobile ? 'front' : 'permanent',
        drawerStyle: {
          width: drawerWidth,
          backgroundColor: '#0F172A',
          borderRightWidth: 0,
        },
        // `overlayStyle` is a DrawerView prop, not a screen option in this
        // drawer version; overlayColor applies the same 0.4 overlay tint.
        overlayColor: 'rgba(0,0,0,0.4)',
        sceneStyle: { flex: 1, backgroundColor: '#F8FAFC' },
        swipeEdgeWidth: 60,
      }}
    >
      <Drawer.Screen name="dashboard" />
      <Drawer.Screen name="approval" />
      <Drawer.Screen name="scheduler" />
      <Drawer.Screen name="memory" />
      <Drawer.Screen name="analytics" />
      <Drawer.Screen name="notifications" />
      <Drawer.Screen name="pricing" />
      <Drawer.Screen name="profile" />
      <Drawer.Screen name="brand-setup" />
    </Drawer>
  );
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppDrawer />
    </SidebarProvider>
  );
}
