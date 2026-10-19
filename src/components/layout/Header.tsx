import { useCallback, useEffect } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Bell, Menu, Search } from 'lucide-react-native';
import { Avatar } from '../ui/Avatar';
import { colors, iconColor } from '../../lib/theme';
import { ROUTES } from '../../constants/routes';
import { MOCK_USER } from '../../constants/user';

interface HeaderProps {
  title: string;
}

/**
 * Structural type rather than the drawer library's own helper type: Expo
 * Router ships its own copy, so importing the drawer type here causes a
 * conflicting-prototype error.
 */
type DrawerNavigation = {
  openDrawer?: () => void;
  getParent?: () => DrawerNavigation | undefined;
};

export function Header({ title }: HeaderProps) {
  const router = useRouter();
  const navigation = useNavigation() as unknown as DrawerNavigation;
  const { width } = useWindowDimensions();
  // Mirrors the web app's `hidden md:block` — the search box and the
  // name/role block only appear once there's room for them.
  const isMobile = width < 768;
  const isWide = !isMobile;
  const hasUnread = true;

  const openNavigation = useCallback(() => {
    if (navigation.openDrawer) {
      navigation.openDrawer();
    } else {
      navigation.getParent?.()?.openDrawer?.();
    }
  }, [navigation]);

  // On web the drawer's scene intercepts trusted mouse presses before
  // Pressable sees them. The native DOM click still fires, so bridge it.
  useEffect(() => {
    if (Platform.OS !== 'web' || !isMobile) return;
    const node = document.querySelector<HTMLElement>(
      '[aria-label="Open navigation menu"]'
    );
    if (!node) return;
    node.dataset.sidebarBridge = 'on';
    node.addEventListener('click', openNavigation);
    return () => node.removeEventListener('click', openNavigation);
  }, [isMobile, openNavigation]);

  return (
    <View className="sticky top-0 z-30 w-full flex-row items-center justify-between border-b border-surface-border bg-white px-4 py-3">
      <View className="flex-1 flex-row items-center">
        {isMobile && (
          <Pressable
            onPress={openNavigation}
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
            className="-my-2 -ml-1 mr-1 h-11 w-11 items-center justify-center rounded-md active:bg-surface-muted"
          >
            <Menu size={22} color={iconColor.subtle} />
          </Pressable>
        )}
        <Text
          className="text-lg font-semibold text-ink"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        {isWide ? (
          <View className="relative justify-center">
            <View className="absolute left-2.5 z-10">
              <Search size={16} color={iconColor.muted} />
            </View>
            <TextInput
              placeholder="Search tasks, goals..."
              placeholderTextColor={colors.ink.placeholder}
              className="h-9 w-64 rounded-md border border-surface-border bg-surface-page pl-9 pr-4 text-sm text-ink"
            />
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search"
            className="h-9 w-9 items-center justify-center rounded-md active:bg-surface-muted"
          >
            <Search size={20} color={iconColor.subtle} />
          </Pressable>
        )}

        <Pressable
          onPress={() => router.push(ROUTES.notifications)}
          className="relative h-9 w-9 items-center justify-center rounded-md active:bg-surface-muted"
        >
          <Bell size={20} color={iconColor.subtle} />
          {hasUnread && (
            <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
          )}
        </Pressable>

        <View className="h-6 w-px bg-surface-border" />

        <Pressable
          onPress={() => router.push(ROUTES.profile)}
          className="flex-row items-center gap-3 active:opacity-80"
        >
          {isWide && (
            <View className="items-end">
              <Text className="text-sm font-medium text-ink">
                {MOCK_USER.name}
              </Text>
              <Text className="text-xs text-ink-subtle">{MOCK_USER.role}</Text>
            </View>
          )}
          <Avatar fallback="AM" src={MOCK_USER.avatar} />
        </Pressable>
      </View>
    </View>
  );
}
