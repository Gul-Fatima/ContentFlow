import { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import {
  AtSign,
  Briefcase,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  Mail,
  MessageSquare,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react-native';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { FadeIn } from '../../src/components/ui/FadeIn';
import { Screen } from '../../src/components/layout/Screen';
import { cn } from '../../src/lib/utils';
import { iconColor, palette } from '../../src/lib/theme';
import type { ContentItem } from '../../src/types';

// Mock data — replaced by `GET /api/content/` once the API is wired up.
const initialContent: ContentItem[] = [
  {
    id: '1',
    platform: 'twitter',
    content:
      "🚀 AI is changing how we work, but it's not replacing creativity. It's amplifying it. Here are 3 ways to use AI as your creative partner, not your replacement. 🧵👇 #AI #Creativity #FutureOfWork",
    reasoning:
      'Aligns with "Thought Leadership" goal. Uses trending hashtags and thread format for higher engagement.',
    scheduledTime: 'Tomorrow, 9:00 AM',
    status: 'pending',
    author: 'Agent',
  },
  {
    id: '2',
    platform: 'linkedin',
    content:
      'Excited to announce our new integration with Slack! Now you can manage your social approvals directly from your team channels. \n\nProductivity just got a major upgrade. 📈\n\nCheck out the link in comments to learn more.',
    image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    reasoning:
      'Product launch announcement. Professional tone matched to LinkedIn audience.',
    scheduledTime: 'Wed, 2:00 PM',
    status: 'pending',
    author: 'Agent',
  },
  {
    id: '3',
    platform: 'instagram',
    content:
      'Behind the scenes at our annual retreat! 🌲✨ \n\nBuilding the future of social media management takes a village (and some fresh air). \n\n#CompanyCulture #Startuplife #TeamBuilding',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    reasoning:
      'Humanizing the brand. Visual content performs best on Instagram.',
    scheduledTime: 'Fri, 5:00 PM',
    status: 'pending',
    author: 'Agent',
  },
  {
    id: '4',
    platform: 'email',
    content:
      "Subject: Your Weekly Social Performance Report 📊\n\nHi Team,\n\nHere are the key highlights from last week's social media performance:\n\n- Total Reach: +15%\n- Engagement Rate: 4.2%\n- Top Post: \"5 Tips for Better Copywriting\"\n\nRead the full report in your dashboard.",
    reasoning: 'Weekly stakeholder update email. Concise and data-driven.',
    scheduledTime: 'Mon, 8:00 AM',
    status: 'pending',
    author: 'Agent',
  },
];

const FILTERS = [
  { id: 'all', label: 'All Pending' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'email', label: 'Email' },
] as const;

/** Brand icons were dropped from lucide 1.x — see Scheduler for the mapping. */
const PLATFORM_ICONS = {
  twitter: { Icon: AtSign, color: '#0EA5E9' },
  instagram: { Icon: Camera, color: '#DB2777' },
  linkedin: { Icon: Briefcase, color: '#1D4ED8' },
  email: { Icon: Mail, color: '#64748B' },
} as const;

function PlatformIcon({ platform }: { platform: string }) {
  const config =
    PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] ??
    ({ Icon: MessageSquare, color: iconColor.subtle } as const);
  const Icon = config.Icon;
  return <Icon size={20} color={config.color} />;
}

export default function ApprovalInboxScreen() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [items, setItems] = useState(initialContent);
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState<string | null>(null);
  const [scheduleValues, setScheduleValues] = useState<
    Record<string, { date: string; time: string }>
  >({});

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' }
          : item
      )
    );
  };

  const handleScheduleChange = (
    id: string,
    field: 'date' | 'time',
    value: string
  ) => {
    setScheduleValues((prev) => {
      const current = prev[id] ?? { date: '', time: '' };
      return { ...prev, [id]: { ...current, [field]: value } };
    });
  };

  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const filteredItems =
    activeTab === 'all'
      ? items.filter((i) => i.status === 'pending')
      : items.filter(
          (i) => i.platform === activeTab && i.status === 'pending'
        );

  return (
    <Screen
      title="Approval Inbox"
      contentClassName="gap-6 p-4 pb-16 md:p-8 md:max-w-5xl"
    >
      <View className="flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-brown md:text-3xl">
            Approval Inbox
          </Text>
          <Text className="text-slate-500">
            Review and manage AI-generated content before it goes live.
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          <Button
            variant="outline"
            leftIcon={<RefreshCw size={16} color={iconColor.subtle} />}
          >
            Regenerate All
          </Button>
          <Button>Approve All Selected</Button>
        </View>
      </View>

      {/* Platform filters */}
      <View className="flex-row flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const isActive = filter.id === activeTab;
          const count = filter.id === 'all' ? pendingCount : undefined;
          return (
            <Pressable
              key={filter.id}
              onPress={() => setActiveTab(filter.id)}
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
                {filter.label}
              </Text>
              {count !== undefined && (
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
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View className="gap-6">
        {filteredItems.length === 0 ? (
          <FadeIn>
            <View className="items-center justify-center rounded-xl border border-dashed border-slate-300 bg-cream px-4 py-16">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Check size={32} color={iconColor.success} />
              </View>
              <Text className="text-lg font-medium text-brown">
                All caught up!
              </Text>
              <Text className="mt-2 max-w-sm text-center text-slate-500">
                No pending items for review. Great job clearing the queue.
              </Text>
            </View>
          </FadeIn>
        ) : (
          filteredItems.map((item, index) => (
            <FadeIn key={item.id} delay={index * 60}>
              <Card className="overflow-hidden">
                <View className="flex-col md:flex-row">
                  {/* Content preview */}
                  <View className="flex-1 border-slate-100 p-6 md:border-r">
                    <View className="mb-4 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <View className="rounded-lg border border-slate-100 bg-cream p-2">
                          <PlatformIcon platform={item.platform} />
                        </View>
                        <View>
                          <Text className="text-sm font-semibold capitalize text-brown">
                            {item.platform}
                          </Text>
                          <View className="flex-row items-center gap-1">
                            <Calendar size={12} color={iconColor.muted} />
                            <Text className="text-xs text-slate-500">
                              {item.scheduledTime}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Badge
                        variant="secondary"
                        className="border-brand-100 bg-brand-50"
                      >
                        AI Draft
                      </Badge>
                    </View>

                    <View className="gap-4">
                      <Text className="font-medium leading-relaxed text-brand-800">
                        {item.content}
                      </Text>
                      {item.image && (
                        <View className="w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                          <Image
                            source={{ uri: item.image }}
                            style={{ width: '100%', aspectRatio: 16 / 9 }}
                            resizeMode="cover"
                          />
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Actions sidebar */}
                  <View className="w-full bg-cream md:w-72">
                    <View className="flex-1 p-3">
                      <Pressable
                        onPress={() =>
                          setExpandedReasoning(
                            expandedReasoning === item.id ? null : item.id
                          )
                        }
                      >
                        <View className="mb-1.5 flex-row items-center justify-between">
                          <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            AI Reasoning
                          </Text>
                          {expandedReasoning === item.id ? (
                            <ChevronUp size={12} color={iconColor.muted} />
                          ) : (
                            <ChevronDown size={12} color={iconColor.muted} />
                          )}
                        </View>
                        <View className="rounded-md border border-slate-200 bg-white p-2.5">
                          <Text
                            className="text-xs text-slate-600"
                            numberOfLines={
                              expandedReasoning === item.id ? undefined : 2
                            }
                          >
                            {item.reasoning}
                          </Text>
                        </View>
                      </Pressable>

                      <View className="mt-4 flex-row items-center gap-3">
                        <Text className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                          Tone
                        </Text>
                        <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                          <View
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: '92%' }}
                          />
                        </View>
                        <Text className="text-xs font-semibold text-slate-700">
                          92
                        </Text>
                      </View>
                    </View>

                    <View className="border-t border-slate-200 bg-white">
                      <View className="flex-row gap-2 p-3">
                        <View className="flex-1">
                          <Button
                            variant="danger"
                            size="sm"
                            className="w-full"
                            leftIcon={<X size={14} color={palette.white} />}
                            onPress={() => handleAction(item.id, 'reject')}
                          >
                            Reject
                          </Button>
                        </View>
                        <View className="flex-1">
                          <Button
                            size="sm"
                            className="w-full bg-emerald-600 active:bg-emerald-700"
                            leftIcon={<Check size={14} color={palette.white} />}
                            onPress={() => handleAction(item.id, 'approve')}
                          >
                            Approve
                          </Button>
                        </View>
                      </View>

                      <View className="flex-row items-center px-3 pb-3">
                        <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-md py-1.5 active:bg-slate-100">
                          <Edit3 size={13} color={iconColor.subtle} />
                          <Text className="text-xs font-medium text-slate-600">
                            Edit
                          </Text>
                        </Pressable>
                        <View className="h-4 w-px bg-slate-200" />
                        <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-md py-1.5 active:bg-slate-100">
                          <Sparkles size={13} color={iconColor.subtle} />
                          <Text className="text-xs font-medium text-slate-600">
                            Recreate
                          </Text>
                        </Pressable>
                        <View className="h-4 w-px bg-slate-200" />
                        <Pressable
                          onPress={() =>
                            setScheduleOpen(
                              scheduleOpen === item.id ? null : item.id
                            )
                          }
                          className={cn(
                            'flex-1 flex-row items-center justify-center gap-1.5 rounded-md py-1.5',
                            scheduleOpen === item.id
                              ? 'bg-brand-50'
                              : 'active:bg-slate-100'
                          )}
                        >
                          <Clock
                            size={13}
                            color={
                              scheduleOpen === item.id
                                ? iconColor.primary
                                : iconColor.subtle
                            }
                          />
                          <Text
                            className={cn(
                              'text-xs font-medium',
                              scheduleOpen === item.id
                                ? 'text-brand-700'
                                : 'text-slate-600'
                            )}
                          >
                            Schedule
                          </Text>
                        </Pressable>
                      </View>

                      {scheduleOpen === item.id && (
                        <View className="gap-2 px-3 pb-3">
                          <View className="flex-row gap-2">
                            <View className="flex-1">
                              <TextInput
                                value={scheduleValues[item.id]?.date ?? ''}
                                onChangeText={(value) =>
                                  handleScheduleChange(item.id, 'date', value)
                                }
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#94A3B8"
                                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-brown"
                              />
                            </View>
                            <View className="w-24">
                              <TextInput
                                value={scheduleValues[item.id]?.time ?? ''}
                                onChangeText={(value) =>
                                  handleScheduleChange(item.id, 'time', value)
                                }
                                placeholder="HH:MM"
                                placeholderTextColor="#94A3B8"
                                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-brown"
                              />
                            </View>
                          </View>
                          <Pressable
                            onPress={() => setScheduleOpen(null)}
                            className="h-7 w-full items-center justify-center rounded-md bg-brand-600 active:bg-brand-700"
                          >
                            <Text className="text-xs font-medium text-white">
                              Update Schedule
                            </Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </Card>
            </FadeIn>
          ))
        )}
      </View>
    </Screen>
  );
}
