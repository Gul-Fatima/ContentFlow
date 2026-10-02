import { Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Search } from 'lucide-react-native';
import { Avatar } from '../ui/Avatar';
import { iconColor } from '../../lib/theme';

const AVATAR_SRC =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  // Mirrors the web app's `hidden md:block` — the search box and the
  // name/role block only appear once there's room for them.
  const isWide = width >= 768;
  const hasUnread = true;

  return (
    <View className="sticky top-0 z-30 w-full flex-row items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <View className="flex-1 flex-row items-center">
        <Text
          className="text-lg font-semibold text-brown"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        {isWide && (
          <View className="relative justify-center">
            <View className="absolute left-2.5 z-10">
              <Search size={16} color={iconColor.muted} />
            </View>
            <TextInput
              placeholder="Search tasks, goals..."
              placeholderTextColor="#94A3B8"
              className="h-9 w-64 rounded-md border border-slate-200 bg-cream pl-9 pr-4 text-sm text-brown"
            />
          </View>
        )}

        <Pressable
          onPress={() => router.push('/notifications')}
          className="relative h-9 w-9 items-center justify-center rounded-md active:bg-slate-100"
        >
          <Bell size={20} color={iconColor.subtle} />
          {hasUnread && (
            <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          )}
        </Pressable>

        <View className="h-6 w-px bg-slate-200" />

        <Pressable
          onPress={() => router.push('/profile')}
          className="flex-row items-center gap-3 active:opacity-80"
        >
          {isWide && (
            <View className="items-end">
              <Text className="text-sm font-medium text-brown">
                Alex Morgan
              </Text>
              <Text className="text-xs text-slate-500">Growth Lead</Text>
            </View>
          )}
          <Avatar fallback="AM" src={AVATAR_SRC} />
        </Pressable>
      </View>
    </View>
  );
}
