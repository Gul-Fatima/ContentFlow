import { Pressable, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NAV_ITEMS } from '../../constants/nav';
import { colors } from '../../lib/theme';
import { cn } from '../../lib/utils';

/** Bar height excluding the bottom safe-area inset. */
export const TAB_BAR_HEIGHT = 64;

const ACTIVE_COLOR = colors.primary[300];
const INACTIVE_COLOR = colors.ink.faint;

/**
 * Mobile (< 768) primary navigation. Renders the same NAV_ITEMS array as the
 * Sidebar, so the two can never drift apart.
 */
export function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="w-full flex-row bg-sidebar"
      style={{
        height: TAB_BAR_HEIGHT + insets.bottom,
        paddingBottom: insets.bottom,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.route;
        const Icon = item.icon;
        const badge = item.badge;

        return (
          <Pressable
            key={item.route}
            onPress={() => router.navigate(item.route)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            aria-selected={isActive}
            accessibilityLabel={
              badge ? `${item.label}, ${badge} pending` : item.label
            }
            className="flex-1 items-center justify-center active:opacity-70"
          >
            {isActive && (
              <View
                className="absolute left-0 right-0 top-0 h-0.5"
                style={{ backgroundColor: colors.primary[500] }}
              />
            )}
            <View className="relative">
              <Icon
                size={22}
                color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
              {badge ? (
                <View
                  className="absolute -right-2 -top-1 h-4 min-w-4 items-center justify-center rounded-full px-1"
                  style={{ backgroundColor: colors.primary[600] }}
                >
                  <Text className="text-caption font-semibold text-white">
                    {badge}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              className={cn(
                'mt-1 text-caption',
                isActive ? 'text-primary-300' : 'text-ink-faint'
              )}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
