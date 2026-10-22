import { useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
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
  Search,
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
import { iconTileColor } from '../../src/components/ui/IconTile';
import { PageHeader } from '../../src/components/ui/PageHeader';
import { StatCard } from '../../src/components/ui/StatCard';
import { Tabs } from '../../src/components/ui/Tabs';
import { Screen } from '../../src/components/layout/Screen';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { ErrorState, Skeleton } from '../../src/components/ui/Skeleton';
import { ResultCount } from '../../src/components/ui/ResultCount';
import { SearchBar } from '../../src/components/ui/SearchBar';
import { cn } from '../../src/lib/utils';
import { colors, iconColor, palette, PLATFORM_COLORS } from '../../src/lib/theme';
import { useAsync } from '../../src/hooks/useAsync';
import { useDebouncedValue } from '../../src/hooks/useDebouncedValue';
import { filterBySearch, normalize } from '../../src/lib/search';
import { listScheduled } from '../../src/services/content/contentService';
import type { Platform } from '../../src/types/content';

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
    color: PLATFORM_COLORS.twitter,
    bg: 'bg-accent-twitter-soft border-accent-twitter-border',
    label: 'Twitter',
  },
  instagram: {
    Icon: Camera,
    color: PLATFORM_COLORS.instagram,
    bg: 'bg-accent-instagram-soft border-accent-instagram-border',
    label: 'Instagram',
  },
  linkedin: {
    Icon: Briefcase,
    color: PLATFORM_COLORS.linkedin,
    bg: 'bg-accent-linkedin-soft border-accent-linkedin-border',
    label: 'LinkedIn',
  },
  email: {
    Icon: Mail,
    color: PLATFORM_COLORS.email,
    bg: 'bg-surface-page border-surface-border',
    label: 'Email',
  },
};

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
  const { width } = useWindowDimensions();
  const { data, loading, error, reload } = useAsync(listScheduled, []);
  const posts = data ?? [];
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  // The 7-column week grid doesn't fit a phone, so narrow screens start on the
  // list view and the week grid is horizontally scrollable when selected.
  const [viewMode, setViewMode] = useState<'week' | 'list'>(() =>
    Dimensions.get('window').width >= 1024 ? 'week' : 'list'
  );

  const tabFilteredPosts =
    activeFilter === 'all'
      ? posts
      : activeFilter === 'drafts'
        ? posts.filter((p) => p.status === 'draft')
        : posts.filter((p) => p.platform === activeFilter);
  const filteredPosts = filterBySearch(
    tabFilteredPosts,
    debouncedQuery,
    (post) => [
      post.title,
      platformConfig[post.platform].label,
      post.status,
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][post.day],
    ]
  );
  const isWide = width >= 768;

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
    { label: 'Scheduled', value: String(totalScheduled), tone: 'primary' as const, Icon: Calendar },
    { label: 'Drafts', value: String(totalDrafts), tone: 'warning' as const, Icon: Edit3 },
    { label: 'This Week', value: String(posts.length), tone: 'success' as const, Icon: Clock },
    { label: 'Best Day', value: 'Tuesday', tone: 'primary' as const, Icon: Sparkles },
  ];

  return (
    <Screen title="Content Scheduler" contentClassName="gap-6 p-4 pb-16 md:p-8">
      {/* Header */}
      <PageHeader
        title="Content Scheduler"
        description="Plan, schedule, and manage your content calendar across all platforms."
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={<Sparkles size={16} color={iconColor.subtle} />}
            >
              AI Auto-Schedule
            </Button>
            <Button leftIcon={<Plus size={16} color={palette.white} />}>
              New Post
            </Button>
          </>
        }
      />

      <View className={isWide ? 'items-end' : undefined}>
        <View className={isWide ? 'w-full max-w-[360px]' : 'w-full'}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search scheduled content..."
          />
        </View>
      </View>
      <ResultCount
        count={filteredPosts.length}
        total={tabFilteredPosts.length}
        active={normalize(query).length > 0}
      />

      {/* Stats */}
      <Grid columns={4} mobileColumns={2} gutter={16}>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            tone={stat.tone}
            icon={<stat.Icon size={24} color={iconTileColor(stat.tone)} />}
          />
        ))}
      </Grid>

      {/* Filters + view toggle */}
      <View className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          items={FILTERS.map((filter) => ({
            key: filter.id,
            label: filter.label,
            count:
              filter.id === 'all'
                ? posts.length
                : filter.id === 'drafts'
                  ? totalDrafts
                  : undefined,
          }))}
          value={activeFilter}
          onChange={setActiveFilter}
        />

        <View className="flex-row overflow-hidden rounded-lg border border-surface-border">
          {(['week', 'list'] as const).map((mode) => {
            const isActive = viewMode === mode;
            const Icon = mode === 'week' ? Calendar : GripVertical;
            return (
              <Pressable
                key={mode}
                onPress={() => setViewMode(mode)}
                className={cn(
                  'flex-row items-center px-3 py-1.5',
                  isActive ? 'bg-primary-600' : 'bg-white active:bg-surface-muted'
                )}
              >
                <Icon
                  size={14}
                  color={isActive ? palette.white : iconColor.subtle}
                />
                <Text
                  className={cn(
                    'ml-1 text-xs font-medium',
                    isActive ? 'text-white' : 'text-ink-muted'
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
          {loading ? (
            <View className="gap-4">
              <Skeleton height={320} />
              <Skeleton height={120} />
              <Skeleton height={120} />
            </View>
          ) : error ? (
            <ErrorState onRetry={reload} />
          ) : posts.length === 0 ? (
            <EmptyState
              icon={<Calendar size={24} color={iconColor.muted} />}
              title="Nothing here yet"
              description="Scheduled content will appear here when you add it."
            />
          ) : normalize(query).length > 0 && filteredPosts.length === 0 ? (
            <EmptyState
              icon={<Search size={24} color={iconColor.muted} />}
              title={`No results for "${query}"`}
              description="Try a different keyword or clear the search."
              actionLabel="Clear search"
              onAction={() => setQuery('')}
            />
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              icon={<Calendar size={24} color={iconColor.muted} />}
              title="No content for this filter"
              description="Choose another platform or view all scheduled content."
            />
          ) : viewMode === 'week' ? (
            <View className="overflow-hidden rounded-lg border border-surface-border bg-white">
              {/* Week header */}
              <View className="flex-row items-center justify-between border-b border-surface-muted bg-surface-page px-4 py-3">
                <Pressable className="rounded-md p-1.5 active:bg-surface-border">
                  <ChevronLeft size={18} color={iconColor.subtle} />
                </Pressable>
                <Text className="text-sm font-semibold text-ink">
                  Feb 9 – Feb 15, 2026
                </Text>
                <Pressable className="rounded-md p-1.5 active:bg-surface-border">
                  <ChevronRight size={18} color={iconColor.subtle} />
                </Pressable>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  {/* Day headers */}
                  <View className="flex-row border-b border-surface-muted">
                    <View style={{ width: 60 }} />
                    {weekDays.map((day, i) => (
                      <View
                        key={day}
                        style={{ width: 110 }}
                        className={cn(
                          'items-center border-l border-surface-muted p-3',
                          i === 0 && 'bg-primary-50'
                        )}
                      >
                        <Text className="text-caption font-bold uppercase tracking-wider text-ink-faint">
                          {day}
                        </Text>
                        <Text
                          className={cn(
                            'text-lg font-bold',
                            i === 0 ? 'text-primary-600' : 'text-ink'
                          )}
                        >
                          {weekDates[i].split(' ')[1]}
                        </Text>
                        {postCountByDay[i] > 0 && (
                          <View className="mt-1 rounded-full bg-surface-muted px-1.5 py-0.5">
                            <Text className="text-caption font-semibold text-ink-subtle">
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
                      className="flex-row border-b border-surface-page"
                      style={{ minHeight: 56 }}
                    >
                      <View
                        style={{ width: 60 }}
                        className="items-end pr-3 pt-2"
                      >
                        <Text className="text-caption font-medium text-ink-faint">
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
                              'border-l border-surface-page p-1',
                              dayIdx === 0 && 'bg-primary-50'
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
                                      'border-primary-400 bg-primary-50'
                                  )}
                                >
                                  <View className="mb-0.5 flex-row items-center gap-1">
                                    <Icon size={10} color={config.color} />
                                    <Text className="text-caption font-semibold text-ink-muted">
                                      {post.time}
                                    </Text>
                                    {post.status === 'draft' && (
                                      <View className="ml-auto rounded bg-warning-soft px-1">
                                        <Text className="text-caption font-bold text-warning-text">
                                          DRAFT
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                  <Text
                                    className="text-caption text-ink-muted"
                                    numberOfLines={1}
                                  >
                                    {post.content}
                                  </Text>
                                </Pressable>
                              );
                            })}
                            {slotPosts.length === 0 && (
                              <Pressable className="items-center justify-center rounded-md border border-dashed border-transparent py-2 active:border-surface-border active:bg-surface-muted">
                                <Plus size={12} color={colors.ink.faint} />
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
                        padding="sm"
                        className={cn(
                          isSelected && 'border-primary-300 bg-primary-50'
                        )}
                      >
                        <CardContent>
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
                                <Text className="text-sm font-semibold text-ink">
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
                                  <Badge variant="neutral">
                                    {post.goalTag}
                                  </Badge>
                                )}
                              </View>
                              <Text
                                className="text-sm text-ink-muted"
                                numberOfLines={1}
                              >
                                {post.content}
                              </Text>
                              <View className="mt-2 flex-row items-center gap-3">
                                <View className="flex-row items-center gap-1">
                                  <Calendar size={12} color={iconColor.muted} />
                                  <Text className="text-xs text-ink-faint">
                                    {weekDays[post.day]}, {weekDates[post.day]}
                                  </Text>
                                </View>
                                <View className="flex-row items-center gap-1">
                                  <Clock size={12} color={iconColor.muted} />
                                  <Text className="text-xs text-ink-faint">
                                    {post.time}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Button variant="ghost" size="icon">
                                <Eye size={14} color={iconColor.muted} />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit3 size={14} color={iconColor.muted} />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 size={14} color={colors.chart.c5} />
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
          <Card padding="none">
            <CardHeader className="px-5 pt-5">
              <View className="flex-row items-center gap-2">
                <CalendarClock size={16} color={colors.primary[500]} />
                <CardTitle className="text-base">Up Next</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              {upcomingPosts.map((post, i) => {
                const config = platformConfig[post.platform];
                const Icon = config.Icon;
                return (
                  <View
                    key={post.id}
                    className={cn(
                      'flex-row items-center gap-3 px-4 py-3',
                      i !== upcomingPosts.length - 1 &&
                        'border-b border-surface-muted'
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
                        className="text-xs font-medium text-ink"
                        numberOfLines={1}
                      >
                        {post.content}
                      </Text>
                      <Text className="text-caption text-ink-faint">
                        {weekDays[post.day]} · {post.time}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </CardContent>
          </Card>

          <Gradient
            colors={[colors.primary[50], colors.primary[100]]}
            className="rounded-lg border border-primary-100 p-5 shadow-sm"
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
                    className="flex-row items-center gap-3 rounded-lg border border-primary-100 bg-white/70 p-2.5"
                  >
                    <Icon size={16} color={config.color} />
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-ink">
                        {bt.day}, {bt.time}
                      </Text>
                      <Text className="text-caption text-ink-subtle">
                        {bt.reason}
                      </Text>
                    </View>
                  </View>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="mt-3"
                rightIcon={<ArrowRight size={14} color={iconColor.primary} />}
              >
                Apply Suggestions
              </Button>
            </CardContent>
          </Gradient>

          <Card padding="sm">
            <CardContent>
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-lg bg-surface-muted">
                  <Globe size={16} color={iconColor.subtle} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-ink">
                    Timezone
                  </Text>
                  <Text className="text-caption text-ink-subtle">
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
