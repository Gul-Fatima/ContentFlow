import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../ui/Avatar';
import { PlanCard } from './PlanCard';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useLogout } from '../../hooks/useLogout';
import { ROUTES } from '../../constants/routes';

export function ProfileMenu({ size }: { size: 'xs' | 'md' }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, initials } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isLoggingOut } = useLogout(() => setIsOpen(false));

  const openProfile = () => {
    setIsOpen(false);
    router.navigate(ROUTES.profile);
  };

  const openBilling = () => {
    // The one plan/upgrade entry point in the menu; the pricing page owns the
    // Checkout and Billing Portal flows.
    setIsOpen(false);
    router.navigate(ROUTES.pricing);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Open profile menu"
        accessibilityState={{ expanded: isOpen }}
        className="flex-row items-center gap-3 active:opacity-80"
      >
        <Avatar fallback={initials} src={user?.avatarUrl} size={size} />
      </Pressable>

      <Modal
        transparent
        visible={isOpen}
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 bg-black/20">
          <Pressable
            className="absolute inset-0"
            accessibilityRole="button"
            accessibilityLabel="Close profile menu"
            onPress={() => setIsOpen(false)}
          />
          <View
            className="absolute right-4 w-64 rounded-lg border border-surface-border bg-white p-3 shadow-lg"
            style={{ top: insets.top + 68 }}
          >
            <View className="border-b border-surface-border px-2 pb-3">
              <Text className="text-sm font-semibold text-ink">
                {user?.name ?? ''}
              </Text>
              <Text className="mt-1 text-xs text-ink-subtle">
                {user?.email ?? ''}
              </Text>
            </View>
            <View className="py-2">
              <PlanCard variant="compact" onNavigate={() => setIsOpen(false)} />
            </View>
            <Pressable
              onPress={openProfile}
              accessibilityRole="button"
              className="rounded-md px-2 py-3 active:bg-surface-muted"
            >
              <Text className="text-sm text-ink">Profile</Text>
            </Pressable>
            <Pressable
              onPress={openBilling}
              accessibilityRole="button"
              className="rounded-md px-2 py-3 active:bg-surface-muted"
            >
              <Text className="text-sm text-ink">Subscription &amp; billing</Text>
            </Pressable>
            <Pressable
              onPress={logout}
              disabled={isLoggingOut}
              accessibilityRole="button"
              className="rounded-md px-2 py-3 active:bg-surface-muted"
            >
              <Text className="text-sm text-ink">
                {isLoggingOut ? 'Signing out...' : 'Log out'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
