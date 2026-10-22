import { Drawer } from 'expo-router/drawer';
import { View, useWindowDimensions } from 'react-native';
import { BottomTabBar } from '../../src/components/layout/BottomTabBar';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { colors } from '../../src/lib/theme';
import { SidebarProvider, useSidebar } from '../../src/context/SidebarContext';
import { SubscriptionProvider } from '../../src/providers/SubscriptionProvider';

function AppDrawer() {
  const { width } = useWindowDimensions();
  const { collapsed } = useSidebar();

  // < 768: bottom tab bar (the drawer never opens)
  // 768–1023: permanent 80px rail, no toggle
  // >= 1024: permanent 256px sidebar, toggle collapses it to 80
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const drawerWidth = isDesktop ? (collapsed ? 80 : 256) : isTablet ? 80 : 0;

  return (
    <Drawer
      // Mobile has no drawer at all: no hamburger, swipe disabled, zero width
      // and no sidebar content, so the bottom bar is the only navigation.
      drawerContent={(props) =>
        isMobile ? null : (
          <Sidebar {...props} collapsed={isDesktop ? collapsed : isTablet} />
        )
      }
      screenOptions={{
        headerShown: false,
        drawerType: isMobile ? 'front' : 'permanent',
        swipeEnabled: !isMobile,
        drawerStyle: {
          width: drawerWidth,
          backgroundColor: colors.sidebar.DEFAULT,
          borderRightWidth: 0,
        },
        // `overlayStyle` is a DrawerView prop, not a screen option in this
        // drawer version; overlayColor applies the same 0.4 overlay tint.
        overlayColor: 'rgba(0,0,0,0.4)',
        sceneStyle: { flex: 1, backgroundColor: colors.surface.page },
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
      <Drawer.Screen name="billing/success" />
      <Drawer.Screen name="billing/cancel" />
    </Drawer>
  );
}

function AppShell() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (!isMobile) return <AppDrawer />;

  return (
    <View className="flex-1">
      <View className="flex-1">
        <AppDrawer />
      </View>
      <BottomTabBar />
    </View>
  );
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      {/* One plan fetch per sign-in; every plan card reads this context. */}
      <SubscriptionProvider>
        <AppShell />
      </SubscriptionProvider>
    </SidebarProvider>
  );
}
