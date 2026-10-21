import {
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, HelpCircle, Link } from 'lucide-react-native';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { iconColor } from '../../lib/theme';
import { ROUTES } from '../../constants/routes';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ProfileMenu } from './ProfileMenu';

const HIT_SLOP = { top: 4, bottom: 4, left: 4, right: 4 };

export function Header() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Mirrors the app breakpoints: below 768 the sidebar becomes the bottom bar.
  const isMobile = width < 768;
  const hasUnread = true;

  const { user, firstName, role } = useCurrentUser();

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
        className={
          isMobile
            ? 'h-14 flex-row items-center gap-3 px-3'
            : 'h-16 flex-row items-center gap-3 px-4'
        }
      >
        {isMobile ? (
          <View className="flex-1 flex-row items-center gap-3">
            <Logo variant="onLight" size="sm" iconOnly />
            <Text
              className="flex-1 text-lg font-semibold text-ink"
              numberOfLines={1}
            >
              Hi {firstName}!
            </Text>
          </View>
        ) : (
          <Text className="flex-1 text-lg font-semibold text-ink">
            Hi {firstName}!
          </Text>
        )}

        {!isMobile && (
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Link size={16} color={iconColor.subtle} />}
            onPress={goConnections}
          >
            Connections
          </Button>
        )}

        {isMobile ? (
          <Pressable
            onPress={() => router.navigate(ROUTES.notifications)}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            className="h-11 w-11 items-center justify-center rounded-full active:bg-surface-muted"
          >
            <View className="relative">
              <Bell size={20} color={iconColor.subtle} />
              {hasUnread && (
                <View className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
              )}
            </View>
          </Pressable>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            accessibilityLabel="Notifications"
            hitSlop={HIT_SLOP}
            onPress={() => router.navigate(ROUTES.notifications)}
          >
            <View className="relative">
              <Bell size={20} color={iconColor.subtle} />
              {hasUnread && (
                <View className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
              )}
            </View>
          </Button>
        )}

        {!isMobile && (
          <>
            <Button
              variant="ghost"
              size="icon"
              accessibilityLabel="Help"
              hitSlop={HIT_SLOP}
              // TODO: help
              onPress={() => {}}
              leftIcon={<HelpCircle size={20} color={iconColor.subtle} />}
            />
            <View className="h-6 w-px bg-surface-border" />
          </>
        )}

        <View className="flex-row items-center gap-3">
          {!isMobile && (
            <View className="items-end">
              <Text className="text-sm font-semibold text-ink">
                {user?.name ?? ''}
              </Text>
              {role ? (
                <Text className="text-xs text-ink-subtle">{role}</Text>
              ) : null}
            </View>
          )}
          <ProfileMenu size={isMobile ? 'xs' : 'md'} />
        </View>
      </View>
    </View>
  );
}
