import { useCallback, useEffect } from 'react';
import {
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';
import { Bell, HelpCircle, Link, Menu } from 'lucide-react-native';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { iconColor } from '../../lib/theme';
import { cn } from '../../lib/utils';
import { ROUTES } from '../../constants/routes';
import { MOCK_USER } from '../../constants/user';

/**
 * Structural type rather than the drawer library's own helper type: Expo
 * Router ships its own copy, so importing the drawer type here causes a
 * conflicting-prototype error.
 */
type DrawerNavigation = {
  openDrawer?: () => void;
  getParent?: () => DrawerNavigation | undefined;
};

const HIT_SLOP = { top: 4, bottom: 4, left: 4, right: 4 };

export function Header() {
  const router = useRouter();
  const navigation = useNavigation() as unknown as DrawerNavigation;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Mirrors the web app's `hidden md:block` — the help icon and the
  // name/role block only appear once there's room for them.
  const isMobile = width < 768;
  const hasUnread = true;

  const firstName = MOCK_USER.name.split(' ')[0];
  const initials = MOCK_USER.name
    .split(' ')
    .map((part) => part[0])
    .join('');

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

  const goConnections = () => {
    // `tab=connected` is read by the profile screen in a later task.
    router.navigate({
      pathname: ROUTES.profile,
      params: { tab: 'connected' },
    });
  };

  return (
    <View
      className="sticky top-0 z-30 w-full border-b border-surface-border bg-white"
      style={{ paddingTop: insets.top }}
    >
      <View
        className={cn(
          'flex-row items-center',
          isMobile ? 'h-14 px-3' : 'h-16 gap-3 px-4'
        )}
      >
        {isMobile && (
          <Pressable
            onPress={openNavigation}
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
            className="-ml-1 h-11 w-11 items-center justify-center rounded-md active:bg-surface-muted"
          >
            <Menu size={22} color={iconColor.subtle} />
          </Pressable>
        )}

        <Text
          className={cn(
            'flex-1 font-semibold text-ink',
            isMobile ? 'text-base' : 'text-lg'
          )}
          numberOfLines={1}
        >
          Hi {firstName}!
        </Text>

        {isMobile ? (
          <Button
            variant="secondary"
            size="icon"
            accessibilityLabel="Connections"
            hitSlop={HIT_SLOP}
            leftIcon={<Link size={18} color={iconColor.subtle} />}
            onPress={goConnections}
          />
        ) : (
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Link size={16} color={iconColor.subtle} />}
            onPress={goConnections}
          >
            Connections
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          accessibilityLabel="Notifications"
          hitSlop={HIT_SLOP}
          onPress={() => router.push(ROUTES.notifications)}
        >
          <View className="relative">
            <Bell size={20} color={iconColor.subtle} />
            {hasUnread && (
              <View className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
            )}
          </View>
        </Button>

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            accessibilityLabel="Help"
            hitSlop={HIT_SLOP}
            // TODO: help
            onPress={() => {}}
            leftIcon={<HelpCircle size={20} color={iconColor.subtle} />}
          />
        )}

        {!isMobile && <View className="h-6 w-px bg-surface-border" />}

        <Pressable
          onPress={() => router.push(ROUTES.profile)}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          className="flex-row items-center gap-3 active:opacity-80"
        >
          {!isMobile && (
            <View className="items-end">
              <Text className="text-sm font-semibold text-ink">
                {MOCK_USER.name}
              </Text>
              <Text className="text-xs text-ink-subtle">{MOCK_USER.role}</Text>
            </View>
          )}
          <Avatar fallback={initials} src={MOCK_USER.avatar} />
        </Pressable>
      </View>
    </View>
  );
}
