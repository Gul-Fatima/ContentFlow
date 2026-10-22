import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  LogOut,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { PlanCard } from './PlanCard';
import { BRAND } from '../../constants/brand';
import { NAV_ITEMS } from '../../constants/nav';
import { ROUTES, type AppRoute } from '../../constants/routes';
import { useSidebar } from '../../context/SidebarContext';
import { useLogout } from '../../hooks/useLogout';
import { colors } from '../../lib/theme';
import { cn } from '../../lib/utils';

const ACTIVE_ICON = colors.primary[300];
const INACTIVE_ICON = colors.ink.faint;
const ACTIVE_BG = 'rgba(99,102,241,0.12)'; // primary-500 at 12% alpha
const ACTIVE_BAR = colors.primary[500];

/**
 * Structural type rather than the drawer library's own prop type: Expo Router
 * ships its own copy of the drawer helpers, so importing the type from
 * `@react-navigation/drawer` produces a conflicting-prototype error.
 */
export interface SidebarProps {
  navigation: { closeDrawer: () => void };
  /** Desktop user preference; ignored below 1024 where the rail is forced. */
  collapsed: boolean;
}

export function Sidebar({ navigation, collapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { toggle } = useSidebar();
  const { logout, isLoggingOut } = useLogout(() => navigation.closeDrawer());

  // 768–1023 is always the collapsed icon rail; the toggle is desktop-only.
  const isDesktop = width >= 1024;
  const isCollapsed = isDesktop ? collapsed : width >= 768;

  const go = (route: AppRoute) => {
    router.navigate(route);
    navigation.closeDrawer();
  };

  return (
    <View className="flex-1 bg-sidebar" style={{ paddingTop: insets.top }}>
      {isCollapsed ? (
        <View
          className="items-center justify-center border-b border-white/10"
          style={{ height: 64 }}
        >
          <Logo variant="onDark" iconOnly />
        </View>
      ) : (
        <View className="border-b border-white/10 px-4 pb-4 pt-4">
          <Logo variant="onDark" />
          <Text className="mt-1.5 text-xs text-ink-faint">{BRAND.tagline}</Text>
        </View>
      )}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View className={cn('py-3', isCollapsed ? 'items-center' : 'px-4')}>
          <Text className="text-xs text-ink-subtle">
            {isCollapsed ? '...' : 'Main Menu'}
          </Text>
        </View>

        <View className={cn(isCollapsed ? 'items-center px-2' : 'px-3')}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.route;
            const Icon = item.icon;

            if (isCollapsed) {
              return (
                <View key={item.route} className="mb-1 h-12 w-12">
                  <Pressable
                    onPress={() => go(item.route)}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                    className={cn(
                      'h-12 w-12 items-center justify-center rounded-lg',
                      !isActive && 'active:bg-sidebar-card'
                    )}
                    style={isActive ? { backgroundColor: ACTIVE_BG } : undefined}
                  >
                    {isActive && (
                      <View
                        className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
                        style={{ backgroundColor: ACTIVE_BAR }}
                      />
                    )}
                    <Icon
                      size={20}
                      color={isActive ? ACTIVE_ICON : INACTIVE_ICON}
                    />
                    {item.badge ? (
                      <View className="absolute -right-1 -top-1 h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-600 px-1">
                        <Text className="text-caption font-semibold text-white">
                          {item.badge}
                        </Text>
                      </View>
                    ) : null}
                  </Pressable>
                </View>
              );
            }

            return (
              <Pressable
                key={item.route}
                onPress={() => go(item.route)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isActive }}
                className={cn(
                  'relative mb-1 h-11 w-full flex-row items-center gap-3 rounded-lg px-3',
                  !isActive && 'active:bg-sidebar-card'
                )}
                style={isActive ? { backgroundColor: ACTIVE_BG } : undefined}
              >
                {isActive && (
                  <View
                    className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
                    style={{ backgroundColor: ACTIVE_BAR }}
                  />
                )}
                <Icon
                  size={20}
                  color={isActive ? ACTIVE_ICON : INACTIVE_ICON}
                />
                <Text
                  className={cn(
                    'flex-1 text-sm font-medium',
                    isActive ? 'text-primary-300' : 'text-ink-faint'
                  )}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                {item.badge ? (
                  <View className="h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1.5">
                    <Text className="text-caption font-semibold text-white">
                      {item.badge}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {isCollapsed ? (
        <View
          className="items-center border-t border-white/10 py-3"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          <Pressable
            onPress={() => go(ROUTES.pricing)}
            accessibilityRole="button"
            accessibilityLabel="Pro Plan"
            className="relative h-10 w-10 items-center justify-center rounded-xl bg-orange-500 active:opacity-80"
          >
            <Crown size={18} color={colors.surface.card} />
            <View className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-success" />
          </Pressable>

          {isDesktop && (
            <Pressable
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel="Expand sidebar"
              className="mt-3 h-10 w-10 items-center justify-center rounded-lg border border-white/10 active:bg-sidebar-card"
            >
              <ChevronRight size={18} color={INACTIVE_ICON} />
            </Pressable>
          )}

          <Button
            variant="primary"
            size="icon"
            className="mt-3 h-12 w-12"
            accessibilityLabel="Logout"
            loading={isLoggingOut}
            leftIcon={<LogOut size={18} color={colors.surface.card} />}
            onPress={logout}
          />
        </View>
      ) : (
        <View
          className="border-t border-white/10 px-3 pt-3"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          <PlanCard onNavigate={() => navigation.closeDrawer()} />

          {isDesktop && (
            <Pressable
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel="Collapse sidebar"
              className="mt-3 h-10 w-full items-center justify-center rounded-lg border border-white/10 active:bg-sidebar-card"
            >
              <ChevronLeft size={18} color={INACTIVE_ICON} />
            </Pressable>
          )}

          <Button
            variant="primary"
            fullWidth
            className="mt-3 h-11"
            loading={isLoggingOut}
            leftIcon={<LogOut size={16} color={colors.surface.card} />}
            onPress={logout}
          >
            Logout
          </Button>
        </View>
      )}
    </View>
  );
}
