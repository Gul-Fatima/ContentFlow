import { Pressable, ScrollView, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import {
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarClock,
  CheckSquare,
  Crown,
  LayoutDashboard,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { Avatar } from '../ui/Avatar';
import { iconColor, palette } from '../../lib/theme';

const AVATAR_SRC =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'approval', label: 'Approval Inbox', icon: CheckSquare, badge: 5 },
  { id: 'scheduler', label: 'Scheduler', icon: CalendarClock, badge: 10 },
  { id: 'memory', label: 'Brand Memory', icon: BrainCircuit },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const;

const usagePercent = 71; // 142 / 200

/**
 * Structural type rather than the drawer library's own prop type: Expo Router
 * ships its own copy of `DrawerNavigationHelpers`, so importing the type from
 * `@react-navigation/drawer` produces a conflicting-prototype error.
 */
export interface SidebarProps {
  navigation: { closeDrawer: () => void };
}

export function Sidebar(props: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activePage = pathname.replace('/', '').split('/')[0] || 'dashboard';

  const go = (id: string) => {
    router.push(`/${id}` as never);
    props.navigation.closeDrawer();
  };

  return (
    <View className="flex-1 bg-brand-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Logo */}
        <View className="flex-row items-center gap-3 border-b border-brand-800 px-5 py-4">
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <Bot size={18} color={palette.white} />
          </View>
          <Text className="text-lg font-bold tracking-tight text-white">
            Agent.ai
          </Text>
        </View>

        {/* User profile */}
        <View className="border-b border-brand-800 px-4 py-4">
          <Pressable
            onPress={() => go('profile')}
            className="w-full flex-row items-center gap-3 rounded-lg bg-brand-800/60 p-3 active:bg-brand-800"
          >
            <Avatar fallback="AM" size="sm" src={AVATAR_SRC} />
            <View className="min-w-0 flex-1">
              <Text className="text-sm font-semibold text-white" numberOfLines={1}>
                Alex Morgan
              </Text>
              <Text className="text-xs text-slate-400" numberOfLines={1}>
                Growth Lead
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Navigation */}
        <View className="flex-1 px-3 py-4">
          <Text className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Main Menu
          </Text>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;
            const badge = 'badge' in item ? item.badge : undefined;
            return (
              <Pressable
                key={item.id}
                onPress={() => go(item.id)}
                className={
                  isActive
                    ? 'relative mb-1 w-full flex-row items-center rounded-lg bg-brand-600/10 px-3 py-2.5'
                    : 'relative mb-1 w-full flex-row items-center rounded-lg px-3 py-2.5 active:bg-brand-800'
                }
              >
                {isActive && (
                  <View className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-500" />
                )}
                <Icon
                  size={20}
                  color={isActive ? iconColor.active : iconColor.muted}
                />
                <Text
                  className={
                    isActive
                      ? 'ml-3 flex-1 text-left text-sm font-medium text-brand-300'
                      : 'ml-3 flex-1 text-left text-sm font-medium text-slate-400'
                  }
                >
                  {item.label}
                </Text>
                {badge ? (
                  <View className="ml-auto h-5 w-5 items-center justify-center rounded-full bg-brand-600">
                    <Text className="text-[10px] font-medium text-white">
                      {badge}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Pricing plan */}
        <View className="border-t border-brand-800 px-4 py-4">
          <View className="rounded-xl border border-brand-700/50 bg-brand-800 p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-6 w-6 items-center justify-center rounded-md bg-amber-500">
                  <Crown size={12} color={palette.white} />
                </View>
                <Text className="text-sm font-bold text-white">Pro Plan</Text>
              </View>
              <View className="rounded-full bg-emerald-400/10 px-2 py-0.5">
                <Text className="text-[10px] font-semibold text-emerald-400">
                  Active
                </Text>
              </View>
            </View>

            <View className="mb-3">
              <View className="flex-row justify-between">
                <Text className="text-xs text-slate-400">Posts used</Text>
                <Text className="text-xs font-medium text-slate-300">
                  142 / 200
                </Text>
              </View>
              <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-700">
                <View
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${usagePercent}%` }}
                />
              </View>
            </View>

            <View className="mb-4 flex-row justify-between">
              <Text className="text-xs text-slate-400">AI Credits</Text>
              <Text className="text-xs font-medium text-slate-300">
                8,420 left
              </Text>
            </View>

            <Pressable
              onPress={() => go('pricing')}
              className="w-full flex-row items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 active:bg-brand-500"
            >
              <Sparkles size={14} color={palette.white} />
              <Text className="text-xs font-semibold text-white">
                Upgrade to Enterprise
              </Text>
            </Pressable>

            <Text className="mt-2 text-center text-[10px] text-slate-500">
              Renews in 18 days
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View className="border-t border-brand-800 p-3">
        <Pressable
          onPress={() => go('profile')}
          className="w-full flex-row items-center rounded-lg px-3 py-2 active:bg-brand-800"
        >
          <Settings size={18} color={iconColor.muted} />
          <Text className="ml-3 text-sm font-medium text-slate-400">
            Settings
          </Text>
        </Pressable>
        <View className="mt-1 flex-row items-center justify-center gap-1 p-2">
          <Zap size={14} color={iconColor.muted} />
          <Text className="text-xs text-slate-500">Agent.ai MVP</Text>
        </View>
      </View>
    </View>
  );
}
