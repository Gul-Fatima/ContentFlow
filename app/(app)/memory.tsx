import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import {
  Edit3,
  Mic2,
  Plus,
  Save,
  Search,
  ShieldAlert,
  Trash2,
  Users,
} from 'lucide-react-native';
import { Button } from '../../src/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Grid } from '../../src/components/ui/Grid';
import { PageHeader } from '../../src/components/ui/PageHeader';
import { Tabs } from '../../src/components/ui/Tabs';
import { Screen } from '../../src/components/layout/Screen';
import { Textarea } from '../../src/components/ui/Textarea';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { ErrorState, Skeleton } from '../../src/components/ui/Skeleton';
import { ResultCount } from '../../src/components/ui/ResultCount';
import { SearchBar } from '../../src/components/ui/SearchBar';
import { colors, iconColor, palette } from '../../src/lib/theme';
import { useAsync } from '../../src/hooks/useAsync';
import { useDebouncedValue } from '../../src/hooks/useDebouncedValue';
import { filterBySearch, normalize } from '../../src/lib/search';
import {
  listBrandRules,
  listPersonas,
} from '../../src/services/content/contentService';

type MemoryTab = 'voice' | 'rules' | 'personas' | 'competitors';

const TABS: { id: MemoryTab; label: string }[] = [
  { id: 'voice', label: 'Voice & Tone' },
  { id: 'rules', label: 'Content Rules' },
  { id: 'personas', label: 'Audience Personas' },
  { id: 'competitors', label: 'Competitors' },
];

const POWER_WORDS = ['Growth', 'Scale', 'Automate', 'Strategy', 'ROI'];
const NEGATIVE_WORDS = ['Cheap', 'Hack', 'Viral', 'Guaranteed'];

const TONE_SLIDERS = [
  { left: 'Casual', right: 'Formal', initial: 60, key: 'formal' },
  { left: 'Playful', right: 'Serious', initial: 40, key: 'serious' },
  { left: 'Short & Punchy', right: 'Detailed', initial: 30, key: 'detailed' },
];

export default function BrandMemoryScreen() {
  const { data: rulesData, loading: rulesLoading, error: rulesError, reload: reloadRules } =
    useAsync(listBrandRules, []);
  const {
    data: personasData,
    loading: personasLoading,
    error: personasError,
    reload: reloadPersonas,
  } = useAsync(listPersonas, []);
  const rules = rulesData ?? [];
  const personas = personasData ?? [];
  const [activeTab, setActiveTab] = useState<MemoryTab>('voice');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const [tones, setTones] = useState<Record<string, number>>({
    formal: 60,
    serious: 40,
    detailed: 30,
  });
  const filteredRules = filterBySearch(
    rules,
    debouncedQuery,
    (rule) => [rule.title]
  );
  const filteredPersonas = filterBySearch(
    personas,
    debouncedQuery,
    (persona) => [
      persona.name,
      persona.role,
      persona.pain,
      persona.goals,
    ]
  );

  return (
    <Screen
      title="Brand Memory"
      contentClassName="gap-6 p-4 pb-16 md:p-8 md:max-w-5xl"
    >
      <PageHeader
        title="Brand Memory"
        description="Configure how the AI represents your brand across channels."
        actions={
          <Button leftIcon={<Save size={16} color={palette.white} />}>
            Save Changes
          </Button>
        }
      />

      {/* Tabs — horizontally scrollable, so 4 long labels never overflow. */}
      <Tabs
        items={TABS.map((tab) => ({ key: tab.id, label: tab.label }))}
        value={activeTab}
        onChange={(key) => {
          setActiveTab(key as MemoryTab);
          setQuery('');
        }}
      />

      {activeTab === 'rules' || activeTab === 'personas' ? (
        <View className="gap-2">
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder={
              activeTab === 'rules' ? 'Search rules...' : 'Search personas...'
            }
          />
          <ResultCount
            count={
              activeTab === 'rules'
                ? filteredRules.length
                : filteredPersonas.length
            }
            total={activeTab === 'rules' ? rules.length : personas.length}
            active={normalize(query).length > 0}
          />
        </View>
      ) : null}

      {activeTab === 'voice' && (
        <View className="gap-8">
          <Card>
            <CardHeader>
              <View className="flex-row items-center gap-2">
                <Mic2 size={20} color={iconColor.primary} />
                <CardTitle>Brand Voice Description</CardTitle>
              </View>
              <CardDescription>
                Describe your brand&apos;s personality, values, and communication
                style. The AI uses this as a base prompt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[150px] text-base"
                defaultValue="We are a helpful, authoritative, yet accessible SaaS brand. We speak to social media managers as peers, understanding their pain points but offering professional solutions. Our tone is optimistic, data-driven, and slightly witty but never unprofessional. We avoid jargon unless it's industry-standard."
              />
            </CardContent>
          </Card>

          <Grid columns={2} gutter={32}>
            <Card>
              <CardHeader>
                <CardTitle>Tone Sliders</CardTitle>
                <CardDescription>
                  Adjust the nuances of your content.
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-8">
                {TONE_SLIDERS.map((tone) => (
                  <View key={tone.key} className="gap-3">
                    <View className="flex-row justify-between">
                      <Text className="text-sm font-medium text-ink-muted">
                        {tone.left}
                      </Text>
                      <Text className="text-sm font-medium text-ink-muted">
                        {tone.right}
                      </Text>
                    </View>
                    <Slider
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={tones[tone.key]}
                      onValueChange={(value) =>
                        setTones((prev) => ({ ...prev, [tone.key]: value }))
                      }
                      minimumTrackTintColor={colors.primary[600]}
                      maximumTrackTintColor={colors.surface.border}
                      thumbTintColor={colors.primary[600]}
                      style={{ width: '100%' }}
                    />
                  </View>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keywords</CardTitle>
                <CardDescription>Words to emphasize or avoid.</CardDescription>
              </CardHeader>
              <CardContent className="gap-6">
                <View>
                  <Text className="mb-2 text-sm font-medium text-ink-muted">
                    Power Words (Use often)
                  </Text>
                  <View className="mb-2 flex-row flex-wrap gap-2">
                    {POWER_WORDS.map((word) => (
                      <Badge key={word} variant="success" className="px-3 py-1">
                        {word}
                      </Badge>
                    ))}
                    <Pressable className="flex-row items-center justify-center rounded-full border border-dashed border-surface-border px-3 py-1 active:bg-surface-muted">
                      <Plus size={12} color={iconColor.subtle} />
                      <Text className="ml-1 text-xs font-medium text-ink-subtle">
                        Add
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View>
                  <Text className="mb-2 text-sm font-medium text-ink-muted">
                    Negative Words (Avoid)
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {NEGATIVE_WORDS.map((word) => (
                      <Badge key={word} variant="danger" className="px-3 py-1">
                        {word}
                      </Badge>
                    ))}
                    <Pressable className="flex-row items-center justify-center rounded-full border border-dashed border-surface-border px-3 py-1 active:bg-surface-muted">
                      <Plus size={12} color={iconColor.subtle} />
                      <Text className="ml-1 text-xs font-medium text-ink-subtle">
                        Add
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </CardContent>
            </Card>
          </Grid>
        </View>
      )}

      {activeTab === 'rules' && (
        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <ShieldAlert size={20} color={iconColor.primary} />
              <CardTitle>Content Guidelines</CardTitle>
            </View>
            <CardDescription>
              Strict rules the AI must follow for every post.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rulesLoading ? (
              <View className="gap-4">
                <Skeleton height={48} />
                <Skeleton height={48} />
                <Skeleton height={48} />
              </View>
            ) : rulesError ? (
              <ErrorState onRetry={reloadRules} />
            ) : rules.length === 0 ? (
              <EmptyState
                icon={<ShieldAlert size={24} color={iconColor.muted} />}
                title="Nothing here yet"
                description="Brand content rules will appear here."
              />
            ) : normalize(query).length > 0 && filteredRules.length === 0 ? (
              <EmptyState
                icon={<Search size={24} color={iconColor.muted} />}
                title={`No results for "${query}"`}
                description="Try a different keyword or clear the search."
                actionLabel="Clear search"
                onAction={() => setQuery('')}
              />
            ) : (
            <View className="gap-4">
              {filteredRules.map((rule) => (
                <View
                  key={rule.id}
                  className="flex-row items-center justify-between rounded-lg border border-surface-muted bg-surface-page p-3"
                >
                  <Text className="flex-1 pr-3 text-ink-muted">{rule.title}</Text>
                  <Button variant="ghost" size="icon">
                    <Trash2 size={16} color={iconColor.muted} />
                  </Button>
                </View>
              ))}
            </View>
            )}
            <Button
              variant="secondary"
              fullWidth
              className="mt-4 border-dashed"
              leftIcon={<Plus size={16} color={iconColor.subtle} />}
            >
              Add New Rule
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'personas' && (
        personasLoading ? (
          <View className="gap-4">
            <Skeleton height={220} />
            <Skeleton height={220} />
          </View>
        ) : personasError ? (
          <ErrorState onRetry={reloadPersonas} />
        ) : personas.length === 0 ? (
          <EmptyState
            icon={<Users size={24} color={iconColor.muted} />}
            title="Nothing here yet"
            description="Audience personas will appear here."
          />
        ) : normalize(query).length > 0 && filteredPersonas.length === 0 ? (
          <EmptyState
            icon={<Search size={24} color={iconColor.muted} />}
            title={`No results for "${query}"`}
            description="Try a different keyword or clear the search."
            actionLabel="Clear search"
            onAction={() => setQuery('')}
          />
        ) : (
        <Grid columns={2} gutter={24}>
          {filteredPersonas.map((persona) => (
            <Card key={persona.name} className="relative overflow-hidden">
              <View className="absolute left-0 top-0 h-full w-1 bg-primary-500" />
              <CardHeader>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center gap-2">
                    <Users size={20} color={iconColor.muted} />
                    <CardTitle>{persona.name}</CardTitle>
                  </View>
                  <Button variant="ghost" size="icon">
                    <Edit3 size={16} color={iconColor.muted} />
                  </Button>
                </View>
                <CardDescription>{persona.role}</CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <View>
                  <Text className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
                    Pain Points
                  </Text>
                  <Text className="mt-1 text-sm text-ink-muted">
                    {persona.pain}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
                    Goals
                  </Text>
                  <Text className="mt-1 text-sm text-ink-muted">
                    {persona.goals}
                  </Text>
                </View>
              </CardContent>
            </Card>
          ))}

          <Card className="min-h-[200px] items-center justify-center border-dashed">
            <Pressable className="items-center p-6 active:opacity-70">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                <Plus size={24} color={iconColor.primary} />
              </View>
              <Text className="font-medium text-ink">Add Persona</Text>
            </Pressable>
          </Card>
        </Grid>
        )
      )}

      {activeTab === 'competitors' && (
        <Card>
          <CardHeader>
            <CardTitle>Competitors</CardTitle>
            <CardDescription>
              Track the brands the AI should position you against.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text className="text-sm text-ink-subtle">
              No competitors tracked yet. Add one to compare positioning and
              tone.
            </Text>
            <Button
              variant="secondary"
              fullWidth
              className="mt-4 border-dashed"
              leftIcon={<Plus size={16} color={iconColor.subtle} />}
            >
              Add Competitor
            </Button>
          </CardContent>
        </Card>
      )}
    </Screen>
  );
}
