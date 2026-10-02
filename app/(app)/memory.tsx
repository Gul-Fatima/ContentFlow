import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Edit3, Mic2, Plus, Save, ShieldAlert, Trash2, Users } from 'lucide-react-native';
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
import { Screen } from '../../src/components/layout/Screen';
import { Textarea } from '../../src/components/ui/Textarea';
import { cn } from '../../src/lib/utils';
import { iconColor, palette } from '../../src/lib/theme';

type MemoryTab = 'voice' | 'rules' | 'personas' | 'competitors';

const TABS: { id: MemoryTab; label: string }[] = [
  { id: 'voice', label: 'Voice & Tone' },
  { id: 'rules', label: 'Content Rules' },
  { id: 'personas', label: 'Audience Personas' },
  { id: 'competitors', label: 'Competitors' },
];

const RULES = [
  'Always use Oxford commas',
  'Never mention competitors by name',
  'Emojis should be used sparingly (max 2 per post)',
  'Always include a Call to Action (CTA)',
  'Dates must be in US format (MM/DD/YYYY)',
];

const POWER_WORDS = ['Growth', 'Scale', 'Automate', 'Strategy', 'ROI'];
const NEGATIVE_WORDS = ['Cheap', 'Hack', 'Viral', 'Guaranteed'];

const PERSONAS = [
  { name: 'The Busy Founder', role: 'Startup CEO', pain: 'No time for consistency' },
  {
    name: 'Agency Alice',
    role: 'Social Media Manager',
    pain: 'Overwhelmed by client approvals',
  },
  { name: 'Marketing Mike', role: 'CMO', pain: 'Need to prove ROI to board' },
];

const TONE_SLIDERS = [
  { left: 'Casual', right: 'Formal', initial: 60, key: 'formal' },
  { left: 'Playful', right: 'Serious', initial: 40, key: 'serious' },
  { left: 'Short & Punchy', right: 'Detailed', initial: 30, key: 'detailed' },
];

export default function BrandMemoryScreen() {
  const [activeTab, setActiveTab] = useState<MemoryTab>('voice');
  const [tones, setTones] = useState<Record<string, number>>({
    formal: 60,
    serious: 40,
    detailed: 30,
  });

  return (
    <Screen
      title="Brand Memory"
      contentClassName="gap-6 p-4 pb-16 md:p-8 md:max-w-5xl"
    >
      <View className="flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <View>
          <Text className="text-2xl font-bold text-brown md:text-3xl">
            Brand Memory
          </Text>
          <Text className="text-slate-500">
            Configure how the AI represents your brand across channels.
          </Text>
        </View>
        <Button leftIcon={<Save size={16} color={palette.white} />}>
          Save Changes
        </Button>
      </View>

      {/* Tabs — the shared Tabs primitive gets cramped with 4 long labels,
          so this page uses a horizontally scrollable pill row. */}
      <View className="flex-row flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={cn(
                'rounded-full px-4 py-2',
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
            </Pressable>
          );
        })}
      </View>

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
                      <Text className="text-sm font-medium text-slate-700">
                        {tone.left}
                      </Text>
                      <Text className="text-sm font-medium text-slate-700">
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
                      minimumTrackTintColor={palette.brand[600]}
                      maximumTrackTintColor="#E2E8F0"
                      thumbTintColor={palette.brand[600]}
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
                  <Text className="mb-2 text-sm font-medium text-slate-700">
                    Power Words (Use often)
                  </Text>
                  <View className="mb-2 flex-row flex-wrap gap-2">
                    {POWER_WORDS.map((word) => (
                      <Badge key={word} variant="success" className="px-3 py-1">
                        {word}
                      </Badge>
                    ))}
                    <Pressable className="flex-row items-center justify-center rounded-full border border-dashed border-slate-300 px-3 py-1 active:bg-cream">
                      <Plus size={12} color={iconColor.subtle} />
                      <Text className="ml-1 text-xs font-medium text-slate-500">
                        Add
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View>
                  <Text className="mb-2 text-sm font-medium text-slate-700">
                    Negative Words (Avoid)
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {NEGATIVE_WORDS.map((word) => (
                      <Badge key={word} variant="error" className="px-3 py-1">
                        {word}
                      </Badge>
                    ))}
                    <Pressable className="flex-row items-center justify-center rounded-full border border-dashed border-slate-300 px-3 py-1 active:bg-cream">
                      <Plus size={12} color={iconColor.subtle} />
                      <Text className="ml-1 text-xs font-medium text-slate-500">
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
            <View className="gap-4">
              {RULES.map((rule, i) => (
                <View
                  key={i}
                  className="flex-row items-center justify-between rounded-lg border border-slate-100 bg-cream p-3"
                >
                  <Text className="flex-1 pr-3 text-slate-700">{rule}</Text>
                  <Button variant="ghost" size="sm">
                    <Trash2 size={16} color={iconColor.muted} />
                  </Button>
                </View>
              ))}
            </View>
            <Button
              variant="outline"
              className="mt-4 w-full border-dashed"
              leftIcon={<Plus size={16} color={iconColor.subtle} />}
            >
              Add New Rule
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'personas' && (
        <Grid columns={2} gutter={24}>
          {PERSONAS.map((persona) => (
            <Card key={persona.name} className="relative overflow-hidden">
              <View className="absolute left-0 top-0 h-full w-1 bg-brand-500" />
              <CardHeader>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center gap-2">
                    <Users size={20} color={iconColor.muted} />
                    <CardTitle>{persona.name}</CardTitle>
                  </View>
                  <Button variant="ghost" size="sm">
                    <Edit3 size={16} color={iconColor.muted} />
                  </Button>
                </View>
                <CardDescription>{persona.role}</CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <View>
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Pain Points
                  </Text>
                  <Text className="mt-1 text-sm text-slate-700">
                    {persona.pain}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Goals
                  </Text>
                  <Text className="mt-1 text-sm text-slate-700">
                    Efficiency, Scale, Automation
                  </Text>
                </View>
              </CardContent>
            </Card>
          ))}

          <Card className="min-h-[200px] items-center justify-center border-dashed">
            <Pressable className="items-center p-6 active:opacity-70">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                <Plus size={24} color={iconColor.primary} />
              </View>
              <Text className="font-medium text-brown">Add Persona</Text>
            </Pressable>
          </Card>
        </Grid>
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
            <Text className="text-sm text-slate-500">
              No competitors tracked yet. Add one to compare positioning and
              tone.
            </Text>
            <Button
              variant="outline"
              className="mt-4 w-full border-dashed"
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
