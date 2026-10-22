import { useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
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
  Search,
  Sparkles,
  X,
} from 'lucide-react-native';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { FadeIn } from '../../src/components/ui/FadeIn';
import { PageHeader } from '../../src/components/ui/PageHeader';
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
import { listApprovals } from '../../src/services/content/contentService';
import type { Approval } from '../../src/types/content';

const FILTERS = [
  { id: 'all', label: 'All Pending' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'email', label: 'Email' },
] as const;

/** Brand icons were dropped from lucide 1.x — see Scheduler for the mapping. */
const PLATFORM_ICONS = {
  twitter: { Icon: AtSign, color: PLATFORM_COLORS.twitter },
  instagram: { Icon: Camera, color: PLATFORM_COLORS.instagram },
  linkedin: { Icon: Briefcase, color: PLATFORM_COLORS.linkedin },
  email: { Icon: Mail, color: PLATFORM_COLORS.email },
} as const;

function PlatformIcon({ platform }: { platform: string }) {
  const config =
    PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] ??
    ({ Icon: MessageSquare, color: iconColor.subtle } as const);
  const Icon = config.Icon;
  return <Icon size={20} color={config.color} />;
}

export default function ApprovalInboxScreen() {
  const { width } = useWindowDimensions();
  const { data, loading, error, reload } = useAsync(listApprovals, []);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [items, setItems] = useState<Approval[] | null>(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState<string | null>(null);
  const [scheduleValues, setScheduleValues] = useState<
    Record<string, { date: string; time: string }>
  >({});
  const allItems = items ?? data ?? [];
  const isWide = width >= 768;

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setItems((prev) =>
      (prev ?? data ?? []).map((item) =>
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

  const pendingItems = allItems.filter((item) => item.status === 'pending');
  const pendingCount = pendingItems.length;
  const tabItems =
    activeTab === 'all'
      ? pendingItems
      : pendingItems.filter((item) => item.platform === activeTab);
  const filteredItems = filterBySearch(
    tabItems,
    debouncedQuery,
    (item) => [item.title, item.body, item.platform, item.scheduledLabel]
  );

  return (
    <Screen
      title="Approval Inbox"
      contentClassName="gap-6 p-4 pb-16 md:p-8 md:max-w-5xl"
    >
      <PageHeader
        title="Approval Inbox"
        description="Review and manage AI-generated content before it goes live."
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={<RefreshCw size={16} color={iconColor.subtle} />}
            >
              Regenerate All
            </Button>
            <Button>Approve All Selected</Button>
          </>
        }
      />

      <View
        className={
          isWide
            ? 'flex-row items-center justify-between gap-4'
            : 'gap-3'
        }
      >
        {!isWide ? (
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search approvals..."
          />
        ) : null}
        <Tabs
          items={FILTERS.map((filter) => ({
            key: filter.id,
            label: filter.label,
            count:
              filter.id === 'all'
                ? pendingCount
                : pendingItems.filter((item) => item.platform === filter.id)
                    .length,
          }))}
          value={activeTab}
          onChange={setActiveTab}
        />
        {isWide ? (
          <View className="w-[280px] shrink-0">
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Search approvals..."
            />
          </View>
        ) : null}
      </View>

      <ResultCount
        count={filteredItems.length}
        total={tabItems.length}
        active={normalize(query).length > 0}
      />

      <View className="gap-6">
        {loading && allItems.length === 0 ? (
          <View className="gap-6">
            <Skeleton height={240} />
            <Skeleton height={240} />
            <Skeleton height={240} />
          </View>
        ) : error ? (
          <ErrorState onRetry={reload} />
        ) : allItems.length === 0 ? (
          <EmptyState
            icon={<Check size={24} color={iconColor.muted} />}
            title="Nothing here yet"
            description="Your approval queue is empty."
          />
        ) : pendingItems.length === 0 ? (
          <FadeIn>
            <View className="items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface-page px-4 py-16">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
                <Check size={32} color={iconColor.success} />
              </View>
              <Text className="text-lg font-medium text-ink">
                All caught up!
              </Text>
              <Text className="mt-2 max-w-sm text-center text-ink-subtle">
                No pending items for review. Great job clearing the queue.
              </Text>
            </View>
          </FadeIn>
        ) : tabItems.length === 0 ? (
          <EmptyState
            icon={<Check size={24} color={iconColor.muted} />}
            title="No pending items for this platform"
            description="There are pending items in other platform filters."
            actionLabel="View all pending"
            onAction={() => setActiveTab('all')}
          />
        ) : normalize(query).length > 0 && filteredItems.length === 0 ? (
          <EmptyState
            icon={<Search size={24} color={iconColor.muted} />}
            title={`No results for "${query}"`}
            description="Try a different keyword or clear the search."
            actionLabel="Clear search"
            onAction={() => setQuery('')}
          />
        ) : (
          filteredItems.map((item, index) => (
            <FadeIn key={item.id} delay={index * 60}>
              <Card padding="none" className="overflow-hidden">
                <View className="flex-col md:flex-row">
                  {/* Content preview */}
                  <View className="flex-1 border-surface-muted p-6 md:border-r">
                    <View className="mb-4 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <View className="rounded-lg border border-surface-muted bg-surface-page p-2">
                          <PlatformIcon platform={item.platform} />
                        </View>
                        <View>
                          <Text className="text-sm font-semibold capitalize text-ink">
                            {item.platform}
                          </Text>
                          <View className="flex-row items-center gap-1">
                            <Calendar size={12} color={iconColor.muted} />
                            <Text className="text-xs text-ink-subtle">
                              {item.scheduledLabel}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Badge variant="primary">AI Draft</Badge>
                    </View>

                    <View className="gap-4">
                      <Text className="font-medium leading-relaxed text-ink">
                        {item.body}
                      </Text>
                      {item.imageUrl && (
                        <View className="w-full overflow-hidden rounded-lg border border-surface-border bg-surface-muted">
                          <Image
                            source={{ uri: item.imageUrl }}
                            style={{ width: '100%', aspectRatio: 16 / 9 }}
                            resizeMode="cover"
                          />
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Actions sidebar */}
                  <View className="w-full bg-surface-page md:w-72">
                    <View className="flex-1 p-3">
                      <Pressable
                        onPress={() =>
                          setExpandedReasoning(
                            expandedReasoning === item.id ? null : item.id
                          )
                        }
                      >
                        <View className="mb-1.5 flex-row items-center justify-between">
                          <Text className="text-caption font-bold uppercase tracking-wider text-ink-faint">
                            AI Reasoning
                          </Text>
                          {expandedReasoning === item.id ? (
                            <ChevronUp size={12} color={iconColor.muted} />
                          ) : (
                            <ChevronDown size={12} color={iconColor.muted} />
                          )}
                        </View>
                        <View className="rounded-md border border-surface-border bg-white p-2.5">
                          <Text
                            className="text-xs text-ink-muted"
                            numberOfLines={
                              expandedReasoning === item.id ? undefined : 2
                            }
                          >
                            {item.aiReasoning}
                          </Text>
                        </View>
                      </Pressable>

                      <View className="mt-4 flex-row items-center gap-3">
                        <Text className="text-caption font-medium uppercase tracking-wide text-ink-faint">
                          Tone
                        </Text>
                        <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-border">
                          <View
                            className="h-full rounded-full bg-success"
                            style={{ width: '92%' }}
                          />
                        </View>
                        <Text className="text-xs font-semibold text-ink-muted">
                          92
                        </Text>
                      </View>
                    </View>

                    <View className="border-t border-surface-border bg-white">
                      <View className="flex-row gap-2 p-3">
                        <View className="flex-1">
                          <Button
                            variant="danger"
                            size="sm"
                            fullWidth
                            leftIcon={<X size={14} color={palette.white} />}
                            onPress={() => handleAction(item.id, 'reject')}
                          >
                            Reject
                          </Button>
                        </View>
                        <View className="flex-1">
                          <Button
                            variant="success"
                            size="sm"
                            fullWidth
                            leftIcon={<Check size={14} color={palette.white} />}
                            onPress={() => handleAction(item.id, 'approve')}
                          >
                            Approve
                          </Button>
                        </View>
                      </View>

                      <View className="flex-row items-center px-3 pb-3">
                        <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-md py-1.5 active:bg-surface-muted">
                          <Edit3 size={13} color={iconColor.subtle} />
                          <Text className="text-xs font-medium text-ink-muted">
                            Edit
                          </Text>
                        </Pressable>
                        <View className="h-4 w-px bg-surface-border" />
                        <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-md py-1.5 active:bg-surface-muted">
                          <Sparkles size={13} color={iconColor.subtle} />
                          <Text className="text-xs font-medium text-ink-muted">
                            Recreate
                          </Text>
                        </Pressable>
                        <View className="h-4 w-px bg-surface-border" />
                        <Pressable
                          onPress={() =>
                            setScheduleOpen(
                              scheduleOpen === item.id ? null : item.id
                            )
                          }
                          className={cn(
                            'flex-1 flex-row items-center justify-center gap-1.5 rounded-md py-1.5',
                            scheduleOpen === item.id
                              ? 'bg-primary-50'
                              : 'active:bg-surface-muted'
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
                                ? 'text-primary-700'
                                : 'text-ink-muted'
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
                                placeholderTextColor={colors.ink.placeholder}
                                className="h-8 w-full rounded-md border border-surface-border bg-white px-2 text-xs text-ink"
                              />
                            </View>
                            <View className="w-24">
                              <TextInput
                                value={scheduleValues[item.id]?.time ?? ''}
                                onChangeText={(value) =>
                                  handleScheduleChange(item.id, 'time', value)
                                }
                                placeholder="HH:MM"
                                placeholderTextColor={colors.ink.placeholder}
                                className="h-8 w-full rounded-md border border-surface-border bg-white px-2 text-xs text-ink"
                              />
                            </View>
                          </View>
                          <Pressable
                            onPress={() => setScheduleOpen(null)}
                            className="h-7 w-full items-center justify-center rounded-md bg-primary-600 active:bg-primary-700"
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
