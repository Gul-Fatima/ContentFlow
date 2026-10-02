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
import { Textarea } from '../../src/components/ui/Textarea';
import { Screen } from '../../src/components/layout/Screen';
import { cn } from '../../src/lib/utils';
import { iconColor, palette } from '../../src/lib/theme';

const AVATAR_SRC =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

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
    color: '#0EA5E9',
    bg: 'bg-sky-50',
  },
  {
    name: 'Instagram',
    Icon: Camera,
    handle: '@agentai.official',
    followers: '12.1k',
    color: '#DB2777',
    bg: 'bg-pink-50',
  },
  {
    name: 'LinkedIn',
    Icon: Briefcase,
    handle: 'Alex Morgan',
    followers: '8,940',
    color: '#1D4ED8',
    bg: 'bg-blue-50',
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
        <Card className="overflow-hidden">
          <Gradient
            colors={[
              palette.brand[500],
              palette.brand[700],
              palette.brand[900],
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
                    source={{ uri: AVATAR_SRC }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                    accessibilityLabel="Alex Morgan"
                  />
                </View>
                <Pressable className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full bg-brand-600 active:bg-brand-700">
                  <Camera size={14} color={palette.white} />
                </Pressable>
              </View>

              <View className="flex-1 gap-1">
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl font-bold text-brown">
                    Alex Morgan
                  </Text>
                  <Badge>Pro</Badge>
                </View>
                <View className="flex-row flex-wrap items-center gap-4">
                  <View className="flex-row items-center gap-1">
                    <Building2 size={14} color={iconColor.muted} />
                    <Text className="text-slate-500">Acme Corp</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MapPin size={14} color={iconColor.muted} />
                    <Text className="text-slate-500">San Francisco, CA</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Clock size={14} color={iconColor.muted} />
                    <Text className="text-slate-500">PST (UTC-8)</Text>
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
                  className="min-h-[80px]"
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
                      i !== quickStats.length - 1 && 'border-b border-slate-100'
                    )}
                  >
                    <View>
                      <Text className="text-sm font-medium text-brown">
                        {stat.value}
                      </Text>
                      <Text className="text-xs text-slate-500">
                        {stat.label}
                      </Text>
                    </View>
                    <View className="rounded-full bg-cream px-2 py-0.5">
                      <Text className="text-[10px] text-slate-400">
                        {stat.period}
                      </Text>
                    </View>
                  </View>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {activityLog.slice(0, 5).map((item, i) => (
                  <View
                    key={i}
                    className="flex-row items-start gap-3 px-6 py-3"
                  >
                    <View className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                    <View className="flex-1">
                      <Text className="text-sm text-slate-700">
                        {item.action}
                      </Text>
                      <Text className="text-xs text-slate-400">{item.time}</Text>
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
                <Card>
                  <CardContent className="p-5">
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
                            <Text className="font-semibold text-brown">
                              {platform.name}
                            </Text>
                            <Badge variant="success">Connected</Badge>
                          </View>
                          <Text className="mt-0.5 text-sm text-slate-500">
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
                        <Button variant="outline" size="sm">
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
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Link2 size={20} color={iconColor.muted} />
                </View>
                <View>
                  <Text className="font-medium text-brown">
                    Connect Another Platform
                  </Text>
                  <Text className="text-sm text-slate-500">
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
                  i !== prefs.length - 1 && 'border-b border-slate-100'
                )}
              >
                <View className="flex-1 pr-4">
                  <Text className="text-sm font-medium text-brown">
                    {pref.label}
                  </Text>
                  <Text className="mt-0.5 text-xs text-slate-500">
                    {pref.description}
                  </Text>
                </View>
                <Switch
                  value={pref.enabled}
                  onValueChange={() => togglePref(i)}
                  trackColor={{ false: '#E2E8F0', true: palette.brand[600] }}
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
              <View className="flex-row items-center justify-between rounded-lg border border-slate-100 bg-cream p-4">
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-medium text-brown">
                    Password last changed
                  </Text>
                  <Text className="text-xs text-slate-500">
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
              <View className="flex-row items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <Smartphone size={20} color={iconColor.success} />
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-brown">
                      Authenticator App
                    </Text>
                    <Text className="text-xs text-emerald-600">
                      Enabled · Last verified 3 days ago
                    </Text>
                  </View>
                </View>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {sessions.map((session, i) => (
                <View
                  key={i}
                  className={cn(
                    'flex-row items-center justify-between px-6 py-4',
                    i !== sessions.length - 1 && 'border-b border-slate-100'
                  )}
                >
                  <View className="flex-1 flex-row items-center gap-3">
                    <View
                      className={cn(
                        'h-2 w-2 rounded-full',
                        session.current ? 'bg-emerald-500' : 'bg-slate-300'
                      )}
                    />
                    <View>
                      <Text className="text-sm font-medium text-brown">
                        {session.device}
                      </Text>
                      <Text className="text-xs text-slate-500">
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
