import { useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  AtSign,
  ArrowRight,
  Briefcase,
  Calendar,
  CalendarClock,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Eye,
  GripVertical,
  Globe,
  Mail,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react-native';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../src/components/ui/Card';
import { FadeIn } from '../../src/components/ui/FadeIn';
import { Gradient } from '../../src/components/ui/Gradient';
import { Grid } from '../../src/components/ui/Grid';
import { Screen } from '../../src/components/layout/Screen';
import { cn } from '../../src/lib/utils';
import { iconColor, palette } from '../../src/lib/theme';

type Platform = 'twitter' | 'instagram' | 'linkedin' | 'email';

interface ScheduledPost {
  id: string;
  platform: Platform;
  content: string;
  time: string;
  day: number; // 0-6 for Mon-Sun
  hour: number; // 0-23
  status: 'scheduled' | 'draft' | 'published' | 'failed';
  goalTag?: string;
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekDates = [
  'Feb 9',
  'Feb 10',
  'Feb 11',
  'Feb 12',
  'Feb 13',
  'Feb 14',
  'Feb 15',
];
const timeSlots = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

/**
 * lucide 1.x dropped the social brand icons (`Twitter`, `Instagram`,
 * `Linkedin`), so each platform maps to the closest neutral glyph.
 */
const platformConfig: Record<
  Platform,
  { Icon: typeof AtSign; color: string; bg: string; label: string }
> = {
  twitter: {
    Icon: AtSign,
    color: '#0EA5E9',
    bg: 'bg-sky-50 border-sky-200',
    label: 'Twitter',
  },
  instagram: {
    Icon: Camera,
    color: '#DB2777',
    bg: 'bg-pink-50 border-pink-200',
    label: 'Instagram',
  },
  linkedin: {
    Icon: Briefcase,
    color: '#1D4ED8',
    bg: 'bg-blue-50 border-blue-200',
    label: 'LinkedIn',
  },
  email: {
    Icon: Mail,
    color: '#475569',
    bg: 'bg-cream border-slate-200',
    label: 'Email',
  },
};

const initialPosts: ScheduledPost[] = [
  {
    id: '1',
    platform: 'twitter',
    content:
      '🚀 AI is changing how we work. Here are 3 ways to use AI as your creative partner...',
    time: '9:00 AM',
    day: 0,
    hour: 9,
    status: 'scheduled',
    goalTag: 'Thought Leadership',
  },
  {
    id: '2',
    platform: 'linkedin',
    content:
      'Excited to announce our new Slack integration! Productivity just got a major upgrade. 📈',
    time: '2:00 PM',
    day: 2,
    hour: 14,
    status: 'scheduled',
    goalTag: 'Product Launch',
  },
  {
    id: '3',
    platform: 'instagram',
    content:
      'Behind the scenes at our annual retreat! 🌲✨ Building the future takes a village...',
    time: '5:00 PM',
    day: 4,
    hour: 17,
    status: 'scheduled',
    goalTag: 'Brand Awareness',
  },
  {
    id: '4',
    platform: 'email',
    content: 'Subject: Your Weekly Social Performance Report 📊',
    time: '8:00 AM',
    day: 0,
    hour: 8,
    status: 'scheduled',
    goalTag: 'Reporting',
  },
  {
    id: '5',
    platform: 'twitter',
    content:
      '5 underrated tools every social media manager needs in 2026. Thread 🧵👇',
    time: '11:00 AM',
    day: 1,
    hour: 11,
    status: 'draft',
  },
  {
    id: '6',
    platform: 'linkedin',
    content:
      'The ROI of AI in marketing: A data-driven breakdown of what actually works...',
    time: '10:00 AM',
    day: 3,
    hour: 10,
    status: 'scheduled',
    goalTag: 'Thought Leadership',
  },
  {
    id: '7',
    platform: 'instagram',
    content:
      'New feature alert! 🎉 Introducing smart scheduling powered by AI...',
    time: '12:00 PM',
    day: 1,
    hour: 12,
    status: 'draft',
  },
  {
    id: '8',
    platform: 'twitter',
    content:
      'Hot take: The best social media strategy is the one you can actually maintain consistently.',
    time: '3:00 PM',
    day: 5,
    hour: 15,
    status: 'scheduled',
  },
  {
    id: '9',
    platform: 'linkedin',
    content:
      "We analyzed 10,000 LinkedIn posts. Here's what the top 1% do differently...",
    time: '9:00 AM',
    day: 4,
    hour: 9,
    status: 'scheduled',
    goalTag: 'Thought Leadership',
  },
  {
    id: '10',
    platform: 'email',
    content: 'Subject: New Feature: AI-Powered Content Calendar',
    time: '10:00 AM',
    day: 2,
    hour: 10,
    status: 'scheduled',
    goalTag: 'Product Launch',
  },
];

const bestTimes = [
  {
    platform: 'twitter' as Platform,
    day: 'Tuesday',
    time: '10:00 AM',
    reason: 'Peak engagement window',
  },
  {
    platform: 'linkedin' as Platform,
    day: 'Wednesday',
    time: '8:00 AM',
    reason: 'Professional morning scroll',
  },
  {
    platform: 'instagram' as Platform,
    day: 'Friday',
    time: '6:00 PM',
    reason: 'Weekend browsing starts',
  },
];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'email', label: 'Email' },
  { id: 'drafts', label: 'Drafts' },
] as const;

function formatHour(h: number) {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

export default function SchedulerScreen() {
  const [posts] = useState(initialPosts);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  // The 7-column week grid doesn't fit a phone, so narrow screens start on the
  // list view and the week grid is horizontally scrollable when selected.
  const [viewMode, setViewMode] = useState<'week' | 'list'>(() =>
    Dimensions.get('window').width >= 1024 ? 'week' : 'list'
  );

  const filteredPosts =
    activeFilter === 'all'
      ? posts
      : activeFilter === 'drafts'
        ? posts.filter((p) => p.status === 'draft')
        : posts.filter((p) => p.platform === activeFilter);

  const getPostsForSlot = (day: number, hour: number) =>
    filteredPosts.filter((p) => p.day === day && p.hour === hour);

  const upcomingPosts = [...filteredPosts]
    .filter((p) => p.status === 'scheduled')
    .sort((a, b) => a.day * 24 + a.hour - (b.day * 24 + b.hour))
    .slice(0, 5);

  const postCountByDay = weekDays.map(
    (_, i) => filteredPosts.filter((p) => p.day === i).length
  );

  const totalScheduled = posts.filter((p) => p.status === 'scheduled').length;
  const totalDrafts = posts.filter((p) => p.status === 'draft').length;

  const stats = [
    { label: 'Scheduled', value: totalScheduled, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Drafts', value: totalDrafts, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'This Week', value: posts.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Best Day', value: 'Tuesday', color: 'text-brand-600', bg: 'bg-brand-50' },
  ];

  return (
    <Screen title="Content Scheduler" contentClassName="gap-6 p-4 pb-16 md:p-8">
      {/* Header */}
      <View className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-brown md:text-3xl">
            Content Scheduler
          </Text>
          <Text className="text-slate-500">
            Plan, schedule, and manage your content calendar across all
            platforms.
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-3">
          <Button
            variant="outline"
            leftIcon={<Sparkles size={16} color={iconColor.subtle} />}
          >
            AI Auto-Schedule
          </Button>
          <Button leftIcon={<Plus size={16} color={palette.white} />}>
            New Post
          </Button>
        </View>
      </View>

      {/* Stats */}
      <Grid columns={4} mobileColumns={2} gutter={16}>
        {stats.map((stat) => (
          <View
            key={stat.label}
            className={cn(
              'flex-row items-center justify-between rounded-xl px-4 py-3',
              stat.bg
            )}
          >
            <Text className="text-sm font-medium text-slate-600">
              {stat.label}
            </Text>
            <Text className={cn('text-lg font-bold', stat.color)}>
              {stat.value}
            </Text>
          </View>
        ))}
      </Grid>

      {/* Filters + view toggle */}
      <View className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <View className="flex-row flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            const count =
              filter.id === 'all'
                ? posts.length
                : filter.id === 'drafts'
                  ? totalDrafts
                  : undefined;
            return (
              <Pressable
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
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
                      isActive ? 'bg-white/20' : 'bg-slate-100'
                    )}
                  >
                    <Text
                      className={cn(
                        'text-xs',
                        isActive ? 'text-white' : 'text-slate-600'
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

        <View className="flex-row overflow-hidden rounded-lg border border-slate-200">
          {(['week', 'list'] as const).map((mode) => {
            const isActive = viewMode === mode;
            const Icon = mode === 'week' ? Calendar : GripVertical;
            return (
              <Pressable
                key={mode}
                onPress={() => setViewMode(mode)}
                className={cn(
                  'flex-row items-center px-3 py-1.5',
                  isActive ? 'bg-brand-600' : 'bg-white active:bg-cream'
                )}
              >
                <Icon
                  size={14}
                  color={isActive ? palette.white : iconColor.subtle}
                />
                <Text
                  className={cn(
                    'ml-1 text-xs font-medium',
                    isActive ? 'text-white' : 'text-slate-600'
                  )}
                >
                  {mode === 'week' ? 'Week' : 'List'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="flex-col gap-6 lg:flex-row">
        {/* Calendar / list */}
        <View style={{ flex: 3 }}>
          {viewMode === 'week' ? (
            <View className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              {/* Week header */}
              <View className="flex-row items-center justify-between border-b border-slate-100 bg-cream px-4 py-3">
                <Pressable className="rounded-md p-1.5 active:bg-slate-200">
                  <ChevronLeft size={18} color={iconColor.subtle} />
                </Pressable>
                <Text className="text-sm font-semibold text-brown">
                  Feb 9 – Feb 15, 2026
                </Text>
                <Pressable className="rounded-md p-1.5 active:bg-slate-200">
                  <ChevronRight size={18} color={iconColor.subtle} />
                </Pressable>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  {/* Day headers */}
                  <View className="flex-row border-b border-slate-100">
                    <View style={{ width: 60 }} />
                    {weekDays.map((day, i) => (
                      <View
                        key={day}
                        style={{ width: 110 }}
                        className={cn(
                          'items-center border-l border-slate-100 p-3',
                          i === 0 && 'bg-brand-50'
                        )}
                      >
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {day}
                        </Text>
                        <Text
                          className={cn(
                            'text-lg font-bold',
                            i === 0 ? 'text-brand-600' : 'text-brown'
                          )}
                        >
                          {weekDates[i].split(' ')[1]}
                        </Text>
                        {postCountByDay[i] > 0 && (
                          <View className="mt-1 rounded-full bg-slate-100 px-1.5 py-0.5">
                            <Text className="text-[9px] font-semibold text-slate-500">
                              {postCountByDay[i]} post
                              {postCountByDay[i] > 1 ? 's' : ''}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>

                  {/* Hour rows */}
                  {timeSlots.map((hour) => (
                    <View
                      key={hour}
                      className="flex-row border-b border-slate-50"
                      style={{ minHeight: 56 }}
                    >
                      <View
                        style={{ width: 60 }}
                        className="items-end pr-3 pt-2"
                      >
                        <Text className="text-[11px] font-medium text-slate-400">
                          {formatHour(hour)}
                        </Text>
                      </View>
                      {weekDays.map((_, dayIdx) => {
                        const slotPosts = getPostsForSlot(dayIdx, hour);
                        return (
                          <View
                            key={dayIdx}
                            style={{ width: 110 }}
                            className={cn(
                              'border-l border-slate-50 p-1',
                              dayIdx === 0 && 'bg-brand-50'
                            )}
                          >
                            {slotPosts.map((post) => {
                              const config = platformConfig[post.platform];
                              const Icon = config.Icon;
                              const isSelected = selectedPost === post.id;
                              return (
                                <Pressable
                                  key={post.id}
                                  onPress={() =>
                                    setSelectedPost(isSelected ? null : post.id)
                                  }
                                  className={cn(
                                    'mb-1 w-full rounded-md border px-2 py-1.5',
                                    config.bg,
                                    isSelected &&
                                      'border-brand-400 bg-brand-50'
                                  )}
                                >
                                  <View className="mb-0.5 flex-row items-center gap-1">
                                    <Icon size={10} color={config.color} />
                                    <Text className="text-[11px] font-semibold text-slate-700">
                                      {post.time}
                                    </Text>
                                    {post.status === 'draft' && (
                                      <View className="ml-auto rounded bg-amber-200 px-1">
                                        <Text className="text-[8px] font-bold text-amber-700">
                                          DRAFT
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                  <Text
                                    className="text-[11px] text-slate-600"
                                    numberOfLines={1}
                                  >
                                    {post.content}
                                  </Text>
                                </Pressable>
                              );
                            })}
                            {slotPosts.length === 0 && (
                              <Pressable className="items-center justify-center rounded-md border border-dashed border-transparent py-2 active:border-slate-200 active:bg-cream">
                                <Plus size={12} color="#CBD5E1" />
                              </Pressable>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            <View className="gap-3">
              {filteredPosts.map((post, i) => {
                const config = platformConfig[post.platform];
                const Icon = config.Icon;
                const isSelected = selectedPost === post.id;
                return (
                  <FadeIn key={post.id} delay={i * 30}>
                    <Pressable
                      onPress={() => setSelectedPost(isSelected ? null : post.id)}
                    >
                      <Card
                        className={cn(
                          isSelected && 'border-brand-300 bg-brand-50'
                        )}
                      >
                        <CardContent className="p-4">
                          <View className="flex-row items-start gap-4">
                            <View
                              className={cn(
                                'h-10 w-10 items-center justify-center rounded-xl border',
                                config.bg
                              )}
                            >
                              <Icon size={18} color={config.color} />
                            </View>
                            <View className="min-w-0 flex-1">
                              <View className="mb-1 flex-row flex-wrap items-center gap-2">
                                <Text className="text-sm font-semibold text-brown">
                                  {config.label}
                                </Text>
                                <Badge
                                  variant={
                                    post.status === 'scheduled'
                                      ? 'success'
                                      : 'warning'
                                  }
                                >
                                  {post.status === 'scheduled'
                                    ? 'Scheduled'
                                    : 'Draft'}
                                </Badge>
                                {post.goalTag && (
                                  <Badge variant="secondary">
                                    {post.goalTag}
                                  </Badge>
                                )}
                              </View>
                              <Text
                                className="text-sm text-slate-600"
                                numberOfLines={1}
                              >
                                {post.content}
                              </Text>
                              <View className="mt-2 flex-row items-center gap-3">
                                <View className="flex-row items-center gap-1">
                                  <Calendar size={12} color={iconColor.muted} />
                                  <Text className="text-xs text-slate-400">
                                    {weekDays[post.day]}, {weekDates[post.day]}
                                  </Text>
                                </View>
                                <View className="flex-row items-center gap-1">
                                  <Clock size={12} color={iconColor.muted} />
                                  <Text className="text-xs text-slate-400">
                                    {post.time}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                                <Eye size={14} color={iconColor.muted} />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                                <Edit3 size={14} color={iconColor.muted} />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                                <Trash2 size={14} color="#FB7185" />
                              </Button>
                            </View>
                          </View>
                        </CardContent>
                      </Card>
                    </Pressable>
                  </FadeIn>
                );
              })}
            </View>
          )}
        </View>

        {/* Right rail */}
        <View className="gap-6" style={{ flex: 1 }}>
          <Card>
            <CardHeader>
              <View className="flex-row items-center gap-2">
                <CalendarClock size={16} color={palette.brand[500]} />
                <CardTitle className="text-base">Up Next</CardTitle>
              </View>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingPosts.map((post, i) => {
                const config = platformConfig[post.platform];
                const Icon = config.Icon;
                return (
                  <View
                    key={post.id}
                    className={cn(
                      'flex-row items-center gap-3 px-4 py-3',
                      i !== upcomingPosts.length - 1 &&
                        'border-b border-slate-100'
                    )}
                  >
                    <View
                      className={cn(
                        'h-8 w-8 items-center justify-center rounded-lg border',
                        config.bg
                      )}
                    >
                      <Icon size={14} color={config.color} />
                    </View>
                    <View className="min-w-0 flex-1">
                      <Text
                        className="text-xs font-medium text-brown"
                        numberOfLines={1}
                      >
                        {post.content}
                      </Text>
                      <Text className="text-[10px] text-slate-400">
                        {weekDays[post.day]} · {post.time}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </CardContent>
          </Card>

          <Gradient
            colors={[palette.brand[50], palette.brand[100]]}
            className="rounded-lg border border-brand-100 shadow-sm"
          >
            <CardHeader>
              <View className="flex-row items-center gap-2">
                <Sparkles size={16} color={iconColor.primary} />
                <CardTitle className="text-base">AI Best Times</CardTitle>
              </View>
              <CardDescription className="text-xs">
                Optimal posting windows based on your audience.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              {bestTimes.map((bt, i) => {
                const config = platformConfig[bt.platform];
                const Icon = config.Icon;
                return (
                  <View
                    key={i}
                    className="flex-row items-center gap-3 rounded-lg border border-brand-100 bg-white/70 p-2.5"
                  >
                    <Icon size={16} color={config.color} />
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-brown">
                        {bt.day}, {bt.time}
                      </Text>
                      <Text className="text-[10px] text-slate-500">
                        {bt.reason}
                      </Text>
                    </View>
                  </View>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
                rightIcon={<ArrowRight size={14} color={iconColor.primary} />}
              >
                Apply Suggestions
              </Button>
            </CardContent>
          </Gradient>

          <Card>
            <CardContent className="p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <Globe size={16} color={iconColor.subtle} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-brown">
                    Timezone
                  </Text>
                  <Text className="text-[11px] text-slate-500">
                    PST (UTC-8) · San Francisco
                  </Text>
                </View>
                <Button variant="ghost" size="sm">
                  Change
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
