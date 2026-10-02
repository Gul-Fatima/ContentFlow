import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Bell,
  CheckCircle2,
  FileCheck,
  MessageSquare,
  Send,
  Settings,
  TrendingUp,
} from 'lucide-react-native';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { FadeIn } from '../../src/components/ui/FadeIn';
import { Screen } from '../../src/components/layout/Screen';
import { cn } from '../../src/lib/utils';
import { iconColor } from '../../src/lib/theme';

type NotificationType = 'approval' | 'published' | 'goal' | 'comment' | 'system';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Content Ready for Approval',
    description:
      'AI generated 3 new Instagram posts for the upcoming summer campaign. Please review and approve them before Friday.',
    time: '2m ago',
    read: false,
    type: 'approval',
  },
  {
    id: '2',
    title: 'Post Published Successfully',
    description:
      'Your scheduled thread about AI trends just went live on Twitter. Initial engagement is looking good!',
    time: '1h ago',
    read: false,
    type: 'published',
  },
  {
    id: '3',
    title: 'Weekly Goal Reached! 🎉',
    description:
      'Engagement is up 12% this week, surpassing your target of 10%. Keep up the great work!',
    time: '3h ago',
    read: true,
    type: 'goal',
  },
  {
    id: '4',
    title: 'New Comment Needs Reply',
    description:
      'Sarah Jenkins commented on your recent LinkedIn post: "Great insights on the future of AI in marketing. Have you considered..."',
    time: '5h ago',
    read: true,
    type: 'comment',
  },
  {
    id: '5',
    title: 'Brand Voice Updated',
    description:
      'Alex Morgan updated the primary brand voice guidelines. All new AI generations will now use the "Professional yet conversational" tone.',
    time: '1d ago',
    read: true,
    type: 'system',
  },
];

type FilterTab =
  | 'all'
  | 'unread'
  | 'approval'
  | 'published'
  | 'goal'
  | 'comment'
  | 'system';

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'approval', label: 'Approvals' },
  { id: 'published', label: 'Published' },
  { id: 'goal', label: 'Goals' },
  { id: 'comment', label: 'Comments' },
  { id: 'system', label: 'System' },
];

const ICON_STYLES: Record<NotificationType, { bg: string; color: string }> = {
  approval: { bg: 'bg-brand-100', color: iconColor.primary },
  published: { bg: 'bg-emerald-100', color: iconColor.success },
  goal: { bg: 'bg-amber-100', color: iconColor.warning },
  comment: { bg: 'bg-blue-100', color: '#2563EB' },
  system: { bg: 'bg-slate-100', color: iconColor.subtle },
};

function NotificationIcon({ type }: { type: NotificationType }) {
  const style = ICON_STYLES[type];
  const Icon =
    type === 'approval'
      ? FileCheck
      : type === 'published'
        ? Send
        : type === 'goal'
          ? TrendingUp
          : type === 'comment'
            ? MessageSquare
            : Settings;

  return (
    <View
      className={cn(
        'h-10 w-10 items-center justify-center rounded-full',
        style.bg
      )}
    >
      <Icon size={20} color={style.color} />
    </View>
  );
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.type === activeTab;
  });

  const activeLabel = TABS.find((t) => t.id === activeTab)?.label;

  return (
    <Screen
      title="Notifications"
      contentClassName="gap-6 p-4 pb-16 md:p-8 md:max-w-5xl"
    >
      {/* Page header */}
      <View className="flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
            <Bell size={24} color={iconColor.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-brown">Notifications</Text>
            <Text className="mt-1 text-sm text-slate-500">
              You have {unreadCount} unread message
              {unreadCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            onPress={markAllAsRead}
            leftIcon={<CheckCircle2 size={16} color={iconColor.subtle} />}
          >
            Mark all as read
          </Button>
        )}
      </View>

      {/* Filter pills */}
      <View className="flex-row flex-wrap gap-2 border-b border-slate-200 pb-4">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const showCount = tab.id === 'unread' && unreadCount > 0;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={cn(
                'flex-row items-center rounded-full px-4 py-2',
                isActive
                  ? 'bg-brand-900'
                  : 'border border-slate-200 bg-white active:bg-slate-100'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-white' : 'text-slate-600'
                )}
              >
                {tab.label}
              </Text>
              {showCount && (
                <View
                  className={cn(
                    'ml-2 items-center justify-center rounded-full px-2 py-0.5',
                    isActive ? 'bg-white/20' : 'bg-brand-100'
                  )}
                >
                  <Text
                    className={cn(
                      'text-xs',
                      isActive ? 'text-white' : 'text-brand-600'
                    )}
                  >
                    {unreadCount}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* List */}
      {filtered.length > 0 ? (
        <View className="gap-4">
          {filtered.map((notification, i) => (
            <FadeIn key={notification.id} delay={i * 50}>
              <Pressable onPress={() => markAsRead(notification.id)}>
                <Card
                  className={cn(
                    'overflow-hidden',
                    !notification.read
                      ? 'border-brand-100 bg-brand-50'
                      : 'bg-white'
                  )}
                >
                  <View className="flex-row gap-4 p-5 sm:gap-6">
                    <View className="mt-1">
                      <NotificationIcon type={notification.type} />
                    </View>

                    <View className="min-w-0 flex-1">
                      <View className="mb-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <Text
                          className={cn(
                            'flex-1 text-base',
                            !notification.read
                              ? 'font-semibold text-brown'
                              : 'font-medium text-brand-800'
                          )}
                        >
                          {notification.title}
                        </Text>
                        <Text className="text-sm text-slate-500">
                          {notification.time}
                        </Text>
                      </View>

                      <Text className="text-sm leading-relaxed text-slate-600">
                        {notification.description}
                      </Text>
                    </View>

                    {!notification.read && (
                      <View className="w-4 items-center justify-center">
                        <View className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                      </View>
                    )}
                  </View>
                </Card>
              </Pressable>
            </FadeIn>
          ))}
        </View>
      ) : (
        <View className="items-center rounded-2xl border-2 border-dashed border-slate-200 bg-cream/50 px-4 py-16">
          <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Bell size={24} color={iconColor.muted} />
          </View>
          <Text className="mb-1 text-lg font-medium text-brown">
            No notifications found
          </Text>
          <Text className="max-w-sm text-center text-slate-500">
            {activeTab === 'all'
              ? "You're all caught up! There are no new notifications at this time."
              : `There are no notifications in the "${activeLabel}" category.`}
          </Text>
          {activeTab !== 'all' && (
            <Button
              variant="outline"
              className="mt-6"
              onPress={() => setActiveTab('all')}
            >
              View all notifications
            </Button>
          )}
        </View>
      )}
    </Screen>
  );
}
