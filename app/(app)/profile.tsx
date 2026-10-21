import { useState } from 'react';
import { Image, Pressable, Switch, Text, View } from 'react-native';
import {
  AtSign,
  Bell,
  Briefcase,
  Building2,
  Camera,
  Check,
  Clock,
  ExternalLink,
  Globe,
  Key,
  Link2,
  MapPin,
  Pencil,
  Shield,
  Smartphone,
  User,
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
import { Input } from '../../src/components/ui/Input';
import { Tabs } from '../../src/components/ui/Tabs';
import { Textarea } from '../../src/components/ui/Textarea';
import { Screen } from '../../src/components/layout/Screen';
import { cn } from '../../src/lib/utils';
import { colors, iconColor, palette, PLATFORM_COLORS } from '../../src/lib/theme';
import { MOCK_USER } from '../../src/constants/user';

type ProfileTab = 'general' | 'platforms' | 'notifications' | 'security';

const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'platforms', label: 'Connected Platforms' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
];

/** Brand icons were dropped from lucide 1.x. */
const connectedPlatforms = [
  {
    name: 'Twitter / X',
    Icon: AtSign,
    handle: '@alexmorgan_ai',
    followers: '4,280',
    color: PLATFORM_COLORS.twitter,
    bg: 'bg-accent-twitter-soft',
  },
  {
    name: 'Instagram',
    Icon: Camera,
    handle: '@agentai.official',
    followers: '12.1k',
    color: PLATFORM_COLORS.instagram,
    bg: 'bg-accent-instagram-soft',
  },
  {
    name: 'LinkedIn',
    Icon: Briefcase,
    handle: 'Alex Morgan',
    followers: '8,940',
    color: PLATFORM_COLORS.linkedin,
    bg: 'bg-accent-linkedin-soft',
  },
];

const activityLog = [
  { action: 'Approved 3 LinkedIn posts', time: '2 hours ago' },
  { action: 'Updated brand voice settings', time: '5 hours ago' },
  { action: 'Created new goal: Q1 Growth', time: '1 day ago' },
  { action: 'Rejected Instagram carousel draft', time: '1 day ago' },
  { action: 'Connected Twitter account', time: '3 days ago' },
  { action: 'Invited Sarah to workspace', time: '5 days ago' },
];

const quickStats = [
  { label: 'Posts Approved', value: '342', period: 'All time' },
  { label: 'Goals Completed', value: '18', period: 'This year' },
  { label: 'Avg. Response Time', value: '2.4h', period: 'Last 30 days' },
  { label: 'Team Members', value: '3', period: 'Active' },
];

const initialPrefs = [
  {
    label: 'Content ready for approval',
    description: 'When the AI finishes drafting content',
    enabled: true,
  },
  {
    label: 'Post published',
    description: 'When approved content goes live',
    enabled: true,
  },
  {
    label: 'Goal milestones',
    description: 'When a goal reaches 25%, 50%, 75%, 100%',
    enabled: true,
  },
  {
    label: 'Weekly performance digest',
    description: 'Summary of your social media metrics',
    enabled: false,
  },
  {
    label: 'AI optimization suggestions',
    description: 'When the agent identifies improvements',
    enabled: true,
  },
  {
    label: 'Team activity',
    description: 'When team members approve or reject content',
    enabled: false,
  },
  {
    label: 'Billing & usage alerts',
    description: 'When approaching plan limits',
    enabled: true,
  },
];

const sessions = [
  {
    device: 'MacBook Pro — Chrome',
    location: 'San Francisco, CA',
    current: true,
    time: 'Now',
  },
  {
    device: 'iPhone 15 — Safari',
    location: 'San Francisco, CA',
    current: false,
    time: '2 hours ago',
  },
];

export default function UserProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [prefs, setPrefs] = useState(initialPrefs);

  const togglePref = (index: number) =>
    setPrefs((prev) =>
      prev.map((pref, i) =>
        i === index ? { ...pref, enabled: !pref.enabled } : pref
      )
    );

  return (
    <Screen
      title="My Profile"
      contentClassName="gap-6 p-4 pb-16 md:p-8 md:max-w-5xl"
    >
      {/* Profile header */}
      <FadeIn>
        <Card padding="none" className="overflow-hidden">
          <Gradient
            colors={[
              colors.primary[400],
              colors.primary[600],
              colors.primary[700],
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 128 }}
          />
          <CardContent className="relative px-6 pb-6">
            <View className="-mt-12 flex-col gap-4 sm:flex-row sm:items-end">
              <View className="relative">
                <View className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg">
                  <Image
                    source={{ uri: MOCK_USER.avatar }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                    accessibilityLabel={MOCK_USER.name}
                  />
                </View>
                <Pressable className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full bg-primary-600 active:bg-primary-700">
                  <Camera size={14} color={palette.white} />
                </Pressable>
              </View>

              <View className="flex-1 gap-1">
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl font-bold text-ink">
                    {MOCK_USER.name}
                  </Text>
                  <Badge variant="primary">Pro</Badge>
                </View>
                <View className="flex-row flex-wrap items-center gap-4">
                  <View className="flex-row items-center gap-1">
                    <Building2 size={14} color={iconColor.muted} />
                    <Text className="text-ink-subtle">Acme Corp</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MapPin size={14} color={iconColor.muted} />
                    <Text className="text-ink-subtle">San Francisco, CA</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Clock size={14} color={iconColor.muted} />
                    <Text className="text-ink-subtle">PST (UTC-8)</Text>
                  </View>
                </View>
              </View>

              <Button
                variant={isEditing ? 'primary' : 'secondary'}
                leftIcon={
                  isEditing ? (
                    <Check size={16} color={palette.white} />
                  ) : (
                    <Pencil size={16} color={iconColor.subtle} />
                  )
                }
                onPress={() => setIsEditing((prev) => !prev)}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </View>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Tabs */}
      <Tabs
        items={TABS.map((tab) => ({ key: tab.id, label: tab.label }))}
        value={activeTab}
        onChange={(key) => setActiveTab(key as ProfileTab)}
      />

      {activeTab === 'general' && (
        <View className="flex-col gap-6 lg:flex-row">
          <View className="gap-6" style={{ flex: 2 }}>
            <Card>
              <CardHeader>
                <View className="flex-row items-center gap-2">
                  <User size={18} color={iconColor.muted} />
                  <CardTitle>Personal Information</CardTitle>
                </View>
              </CardHeader>
              <CardContent>
                <Grid columns={2} gutter={16}>
                  <Input label="First Name" defaultValue="Alex" editable={isEditing} />
                  <Input label="Last Name" defaultValue="Morgan" editable={isEditing} />
                  <Input
                    label="Email"
                    defaultValue="alex@acmecorp.com"
                    keyboardType="email-address"
                    editable={isEditing}
                  />
                  <Input
                    label="Phone"
                    defaultValue="+1 (555) 123-4567"
                    keyboardType="phone-pad"
                    editable={isEditing}
                  />
                  <Input label="Company" defaultValue="Acme Corp" editable={isEditing} />
                  <Input label="Role" defaultValue="Growth Lead" editable={isEditing} />
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <View className="flex-row items-center gap-2">
                  <Globe size={18} color={iconColor.muted} />
                  <CardTitle>Bio &amp; Links</CardTitle>
                </View>
              </CardHeader>
              <CardContent className="gap-4">
                <Textarea
                  label="Bio"
                  defaultValue="Growth Lead at Acme Corp. Passionate about leveraging AI to scale social media presence. Building the future of automated marketing."
                  editable={isEditing}
                />
                <Input
                  label="Website"
                  defaultValue="https://alexmorgan.dev"
                  editable={isEditing}
                />
              </CardContent>
            </Card>
          </View>

          <View className="gap-6" style={{ flex: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="gap-4">
                {quickStats.map((stat, i) => (
                  <View
                    key={stat.label}
                    className={cn(
                      'flex-row items-center justify-between py-2',
                      i !== quickStats.length - 1 && 'border-b border-surface-muted'
                    )}
                  >
                    <View>
                      <Text className="text-sm font-medium text-ink">
                        {stat.value}
                      </Text>
                      <Text className="text-xs text-ink-subtle">
                        {stat.label}
                      </Text>
                    </View>
                    <View className="rounded-full bg-surface-page px-2 py-0.5">
                      <Text className="text-caption text-ink-faint">
                        {stat.period}
                      </Text>
                    </View>
                  </View>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-6 pt-6 pb-5">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activityLog.slice(0, 5).map((item, i) => (
                  <View
                    key={i}
                    className="flex-row items-start gap-3 px-6 py-3"
                  >
                    <View className="mt-1 h-2 w-2 rounded-full bg-primary-400" />
                    <View className="flex-1">
                      <Text className="text-sm text-ink-muted">
                        {item.action}
                      </Text>
                      <Text className="text-xs text-ink-faint">{item.time}</Text>
                    </View>
                  </View>
                ))}
              </CardContent>
            </Card>
          </View>
        </View>
      )}

      {activeTab === 'platforms' && (
        <View className="gap-4">
          {connectedPlatforms.map((platform, i) => {
            const Icon = platform.Icon;
            return (
              <FadeIn key={platform.name} delay={i * 80}>
                <Card padding="sm">
                  <CardContent>
                    <View className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <View className="flex-row items-center gap-4">
                        <View
                          className={cn(
                            'h-12 w-12 items-center justify-center rounded-xl',
                            platform.bg
                          )}
                        >
                          <Icon size={22} color={platform.color} />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2">
                            <Text className="font-semibold text-ink">
                              {platform.name}
                            </Text>
                            <Badge variant="success">Connected</Badge>
                          </View>
                          <Text className="mt-0.5 text-sm text-ink-subtle">
                            {platform.handle} · {platform.followers} followers
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={
                            <ExternalLink size={14} color={iconColor.subtle} />
                          }
                        >
                          View
                        </Button>
                        <Button variant="secondary" size="sm">
                          Disconnect
                        </Button>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}

          <Card className="border-dashed">
            <Pressable className="active:opacity-70">
              <CardContent className="flex-row items-center justify-center gap-3 py-8">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-muted">
                  <Link2 size={20} color={iconColor.muted} />
                </View>
                <View>
                  <Text className="font-medium text-ink">
                    Connect Another Platform
                  </Text>
                  <Text className="text-sm text-ink-subtle">
                    Facebook, TikTok, Pinterest, and more
                  </Text>
                </View>
              </CardContent>
            </Pressable>
          </Card>
        </View>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Bell size={18} color={iconColor.muted} />
              <CardTitle>Notification Preferences</CardTitle>
            </View>
            <CardDescription>
              Choose how and when you want to be notified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {prefs.map((pref, i) => (
              <View
                key={pref.label}
                className={cn(
                  'flex-row items-center justify-between py-4',
                  i !== prefs.length - 1 && 'border-b border-surface-muted'
                )}
              >
                <View className="flex-1 pr-4">
                  <Text className="text-sm font-medium text-ink">
                    {pref.label}
                  </Text>
                  <Text className="mt-0.5 text-xs text-ink-subtle">
                    {pref.description}
                  </Text>
                </View>
                <Switch
                  value={pref.enabled}
                  onValueChange={() => togglePref(i)}
                  trackColor={{ false: colors.surface.border, true: colors.primary[600] }}
                  thumbColor={palette.white}
                />
              </View>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 'security' && (
        <View className="gap-6">
          <Card>
            <CardHeader>
              <View className="flex-row items-center gap-2">
                <Key size={18} color={iconColor.muted} />
                <CardTitle>Password</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              <View className="flex-row items-center justify-between rounded-lg border border-surface-muted bg-surface-page p-4">
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-medium text-ink">
                    Password last changed
                  </Text>
                  <Text className="text-xs text-ink-subtle">
                    December 15, 2025
                  </Text>
                </View>
                <Button variant="secondary" size="sm">
                  Change Password
                </Button>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <View className="flex-row items-center gap-2">
                <Shield size={18} color={iconColor.muted} />
                <CardTitle>Two-Factor Authentication</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              <View className="flex-row items-center justify-between rounded-lg border border-success-soft bg-success-soft p-4">
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-lg bg-success-soft">
                    <Smartphone size={20} color={iconColor.success} />
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-ink">
                      Authenticator App
                    </Text>
                    <Text className="text-xs text-success">
                      Enabled · Last verified 3 days ago
                    </Text>
                  </View>
                </View>
                <Button variant="secondary" size="sm">
                  Manage
                </Button>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-6 pt-6 pb-5">
              <CardTitle className="text-base">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.map((session, i) => (
                <View
                  key={i}
                  className={cn(
                    'flex-row items-center justify-between px-6 py-4',
                    i !== sessions.length - 1 && 'border-b border-surface-muted'
                  )}
                >
                  <View className="flex-1 flex-row items-center gap-3">
                    <View
                      className={cn(
                        'h-2 w-2 rounded-full',
                        session.current ? 'bg-success' : 'bg-surface-border'
                      )}
                    />
                    <View>
                      <Text className="text-sm font-medium text-ink">
                        {session.device}
                      </Text>
                      <Text className="text-xs text-ink-subtle">
                        {session.location} · {session.time}
                      </Text>
                    </View>
                  </View>
                  {session.current ? (
                    <Badge variant="success">Current</Badge>
                  ) : (
                    <Button variant="ghost" size="sm">
                      Revoke
                    </Button>
                  )}
                </View>
              ))}
            </CardContent>
          </Card>
        </View>
      )}
    </Screen>
  );
}
