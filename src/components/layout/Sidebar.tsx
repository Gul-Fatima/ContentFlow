import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import {
  BarChart3,
  Bot,
  Brain,
  CalendarClock,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Crown,
  LayoutGrid,
  Sparkles,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES, type AppRoute } from '../../constants/routes';
import { useSidebar } from '../../context/SidebarContext';
import { colors } from '../../lib/theme';
import { cn } from '../../lib/utils';

const navItems = [
  { route: ROUTES.dashboard, label: 'Dashboard', icon: LayoutGrid },
  {
    route: ROUTES.approval,
    label: 'Approval Inbox',
    icon: CheckSquare,
    badge: 5,
  },
  {
    route: ROUTES.scheduler,
    label: 'Scheduler',
    icon: CalendarClock,
    badge: 10,
  },
  { route: ROUTES.memory, label: 'Brand Memory', icon: Brain },
  { route: ROUTES.analytics, label: 'Analytics', icon: BarChart3 },
] as const;

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
  collapsed: boolean;
}

export function Sidebar({ navigation, collapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { toggle } = useSidebar();

  const isMobile = width < 768;
  const isCollapsed = collapsed && !isMobile;

  const go = (route: AppRoute) => {
    router.navigate(route);
    navigation.closeDrawer();
  };

  const logo = (
    <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
      <Bot size={22} color={colors.surface.card} />
    </View>
  );

  return (
    <View
      className="flex-1 bg-ink"
      style={{ paddingTop: insets.top }}
    >
      {isCollapsed ? (
        <View
          className="items-center justify-center border-b border-white/10"
          style={{ height: 64 }}
        >
          {logo}
        </View>
      ) : (
        <View
          className="flex-row items-center gap-3 border-b border-white/10 px-4"
          style={{ height: 64 }}
        >
          {logo}
          <Text className="text-lg font-semibold text-white">Agent.ai</Text>
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
          {navItems.map((item) => {
            const isActive = pathname === item.route;
            const Icon = item.icon;
            const badge = 'badge' in item ? item.badge : undefined;

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
                    {badge ? (
                      <View className="absolute -right-1 -top-1 h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-600 px-1">
                        <Text className="text-caption font-semibold text-white">
                          {badge}
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
                {badge ? (
                  <View className="h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1.5">
                    <Text className="text-caption font-semibold text-white">
                      {badge}
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

          {!isMobile && (
            <Pressable
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel="Expand sidebar"
              className="mt-3 h-10 w-10 items-center justify-center rounded-lg border border-white/10 active:bg-sidebar-card"
            >
              <ChevronRight size={18} color={INACTIVE_ICON} />
            </Pressable>
          )}
        </View>
      ) : (
        <View
          className="border-t border-white/10 px-3 pt-3"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          <View
            className="rounded-2xl border bg-sidebar-card p-4"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-6 w-6 items-center justify-center rounded-md bg-orange-500">
                  <Crown size={12} color={colors.surface.card} />
                </View>
                <Text className="text-sm font-semibold text-white">
                  Pro Plan
                </Text>
              </View>
              <View
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: 'rgba(16,185,129,0.15)' }}
              >
                <Text className="text-xs font-semibold text-success">
                  Active
                </Text>
              </View>
            </View>

            <View className="mb-3">
              <View className="flex-row justify-between">
                <Text className="text-xs text-ink-faint">Posts used</Text>
                <Text className="text-xs text-white">142 / 200</Text>
              </View>
              <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-muted">
                <View
                  className="h-full rounded-full"
                  style={{ width: '71%', backgroundColor: colors.primary[500] }}
                />
              </View>
            </View>

            <View className="mb-4 flex-row justify-between">
              <Text className="text-xs text-ink-faint">AI Credits</Text>
              <Text className="text-xs text-white">8,420 left</Text>
            </View>

            <Pressable
              onPress={() => go(ROUTES.pricing)}
              accessibilityRole="button"
              accessibilityLabel="Upgrade to Enterprise"
              className="h-10 w-full flex-row items-center justify-center gap-2 rounded-lg bg-primary-600 active:bg-primary-500"
            >
              <Sparkles size={14} color={colors.surface.card} />
              <Text className="text-xs font-semibold text-white">
                Upgrade to Enterprise
              </Text>
            </Pressable>

            <Text className="mt-2 text-center text-caption text-ink-subtle">
              Renews in 18 days
            </Text>
          </View>

          {!isMobile && (
            <Pressable
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel="Collapse sidebar"
              className="mt-3 h-10 w-full items-center justify-center rounded-lg border border-white/10 active:bg-sidebar-card"
            >
              <ChevronLeft size={18} color={INACTIVE_ICON} />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
