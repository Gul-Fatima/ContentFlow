import { useState } from 'react';
import {
  Pressable,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AtSign,
  Bell,
  Briefcase,
  Building2,
  Camera,
  Check,
  Clock,
  CreditCard,
  ExternalLink,
  Globe,
  Key,
  Link2,
  LogOut,
  MapPin,
  Pencil,
  Receipt,
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
import { ErrorState, Skeleton } from '../../src/components/ui/Skeleton';
import { PaymentFailedBanner } from '../../src/components/billing/PaymentFailedBanner';
import { Screen } from '../../src/components/layout/Screen';
import { ROUTES } from '../../src/constants/routes';
import { ApiError } from '../../src/lib/api';
import { formatCurrency, formatDate, formatLimit } from '../../src/lib/format';
import { openInBrowser } from '../../src/lib/openExternal';
import {
  hasBillingAccount,
  planName,
  renewalLabel,
  statusPill,
  usagePercent,
} from '../../src/lib/subscription';
import { cn } from '../../src/lib/utils';
import { colors, iconColor, palette, PLATFORM_COLORS } from '../../src/lib/theme';
import { useAsync } from '../../src/hooks/useAsync';
import { useCurrentUser } from '../../src/hooks/useCurrentUser';
import { useLogout } from '../../src/hooks/useLogout';
import { useManageBilling } from '../../src/hooks/useManageBilling';
import { useSubscription } from '../../src/providers/SubscriptionProvider';
import { listInvoices } from '../../src/services/billing/billingService';
import type { Invoice } from '../../src/services/billing/types';

type ProfileTab =
  | 'general'
  | 'platforms'
  | 'notifications'
  | 'billing'
  | 'security';

const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'platforms', label: 'Connected Platforms' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing' },
  { id: 'security', label: 'Security' },
];

const TAB_IDS = TABS.map((tab) => tab.id);

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
  const params = useLocalSearchParams<{ tab?: string }>();
  // A tap wins over the URL, so no effect is needed to keep them in sync:
  // `/profile?tab=billing` lands on Billing, tapping another tab switches away.
  const [selectedTab, setSelectedTab] = useState<ProfileTab | null>(null);
  const paramTab =
    typeof params.tab === 'string' && TAB_IDS.includes(params.tab as ProfileTab)
      ? (params.tab as ProfileTab)
      : null;
  const activeTab: ProfileTab = selectedTab ?? paramTab ?? 'general';
  const setActiveTab = setSelectedTab;

  const [isEditing, setIsEditing] = useState(false);
  const [prefs, setPrefs] = useState(initialPrefs);

  const { user, firstName, lastName, initials, company } = useCurrentUser();
  const { logout, isLoggingOut } = useLogout();
  const { subscription } = useSubscription();

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
                <View
                  className="h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-primary-100 shadow-lg"
                  accessibilityLabel={user?.name ?? ''}
                >
                  <Text className="text-2xl font-semibold text-primary-700">
                    {initials}
                  </Text>
                </View>
                <Pressable className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full bg-primary-600 active:bg-primary-700">
                  <Camera size={14} color={palette.white} />
                </Pressable>
              </View>

              <View className="flex-1 gap-1">
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl font-bold text-ink">
                    {user?.name ?? ''}
                  </Text>
                  {subscription?.isActive ? (
                    <Badge variant="primary">
                      {planName(subscription.plan)}
                    </Badge>
                  ) : null}
                </View>
                <View className="flex-row flex-wrap items-center gap-4">
                  {company ? (
                    <View className="flex-row items-center gap-1">
                      <Building2 size={14} color={iconColor.muted} />
                      <Text className="text-ink-subtle">{company}</Text>
                    </View>
                  ) : null}
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
                  <Input
                    label="First Name"
                    defaultValue={firstName}
                    editable={isEditing}
                  />
                  <Input
                    label="Last Name"
                    defaultValue={lastName}
                    editable={isEditing}
                  />
                  <Input
                    label="Email"
                    defaultValue={user?.email ?? ''}
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

      {activeTab === 'billing' && <BillingTab />}

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

          <Card>
            <CardHeader>
              <View className="flex-row items-center gap-2">
                <LogOut size={18} color={iconColor.muted} />
                <CardTitle>Sign out</CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-3">
              <Text className="text-sm text-ink-subtle">
                End the session on this device. You will be returned to the
                welcome screen.
              </Text>
              <Button
                variant="danger"
                fullWidth
                loading={isLoggingOut}
                leftIcon={<LogOut size={16} color={palette.white} />}
                onPress={logout}
              >
                Sign out
              </Button>
            </CardContent>
          </Card>
        </View>
      )}
    </Screen>
  );
}/**
 * The Billing tab: real plan state and real invoices.
 *
 * Every value comes from the backend (`/api/billing/subscription` and
 * `/api/billing/invoices`); nothing here can be satisfied by a local mock. When
 * Stripe reports `past_due` the banner stays above both cards.
 */
function BillingTab() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const { subscription, loading, error, reload } = useSubscription();
  const { manageBilling, isOpening, error: portalError } = useManageBilling();

  const invoicesRequest = useAsync(listInvoices, []);
  const invoices = invoicesRequest.data;
  const invoicesLoading = invoicesRequest.loading;
  const invoicesError =
    invoicesRequest.error instanceof ApiError
      ? invoicesRequest.error
      : invoicesRequest.error
        ? new ApiError(0, 'UNKNOWN', 'Could not load invoices.')
        : null;

  const pill = statusPill(subscription);
  const billingAccount = hasBillingAccount(subscription);
  const name = planName(subscription?.plan);
  const intervalLabel =
    subscription?.interval === 'year'
      ? 'Billed yearly'
      : subscription?.interval === 'month'
        ? 'Billed monthly'
        : '';
  const renewal = renewalLabel(subscription);
  const pastDue = subscription?.status === 'past_due';

  return (
    <View className="gap-6">
      {pastDue ? <PaymentFailedBanner /> : null}

      <Card>
        <CardHeader>
          <View className="flex-row items-center gap-2">
            <CreditCard size={18} color={iconColor.muted} />
            <CardTitle>Current plan</CardTitle>
          </View>
        </CardHeader>
        <CardContent className="gap-4">
          {loading ? (
            <Skeleton height={96} />
          ) : error ? (
            <ErrorState
              message="We couldn't load your plan."
              onRetry={() => void reload()}
            />
          ) : (
            <>
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-lg font-semibold text-ink">
                  {billingAccount ? `${name} Plan` : 'No active plan'}
                </Text>
                {pill ? (
                  <Badge variant={pill.tone}>{pill.label}</Badge>
                ) : (
                  <Badge variant="neutral">No plan</Badge>
                )}
              </View>

              {billingAccount ? (
                <Text className="text-sm text-ink-subtle">
                  {[intervalLabel, renewal].filter(Boolean).join(' · ')}
                </Text>
              ) : (
                <Text className="text-sm text-ink-subtle">
                  Choose a plan to unlock AI content generation.
                </Text>
              )}

              {billingAccount ? (
                <View className="gap-4">
                  <UsageLine
                    label="Posts this period"
                    used={subscription?.usage.postsUsed ?? 0}
                    limit={subscription?.usage.postsLimit ?? null}
                    barColor={colors.primary[500]}
                  />
                  <UsageLine
                    label="AI credits"
                    used={subscription?.usage.creditsUsed ?? 0}
                    limit={subscription?.usage.creditsLimit ?? null}
                    barColor={colors.success.DEFAULT}
                  />
                </View>
              ) : null}

              <View className="flex-row flex-wrap gap-3 pt-1">
                <Button
                  variant="primary"
                  onPress={() => router.navigate(ROUTES.pricing)}
                >
                  Change plan
                </Button>
                {billingAccount ? (
                  <Button
                    variant="secondary"
                    loading={isOpening}
                    onPress={() => void manageBilling()}
                  >
                    Manage billing
                  </Button>
                ) : null}
              </View>
              {portalError ? (
                <Text className="text-xs text-danger">{portalError}</Text>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      <Card padding="none">
        <CardHeader className="px-6 pb-5 pt-6">
          <View className="flex-row items-center gap-2">
            <Receipt size={18} color={iconColor.muted} />
            <CardTitle>Billing history</CardTitle>
          </View>
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <View className="gap-3 px-6 pb-6">
              <Skeleton height={44} />
              <Skeleton height={44} />
            </View>
          ) : invoicesError ? (
            <View className="px-6 pb-6">
              <ErrorState
                message="We couldn't load your invoices."
                onRetry={invoicesRequest.reload}
              />
            </View>
          ) : !invoices || invoices.length === 0 ? (
            <Text className="px-6 pb-6 text-sm text-ink-subtle">
              No invoices yet. Invoices will appear here once you subscribe.
            </Text>
          ) : (
            invoices.map((invoice, index) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                isMobile={isMobile}
                isLast={index === invoices.length - 1}
              />
            ))
          )}
        </CardContent>
      </Card>
    </View>
  );
}

function InvoiceRow({
  invoice,
  isMobile,
  isLast,
}: {
  invoice: Invoice;
  isMobile: boolean;
  isLast: boolean;
}) {
  const url = invoice.hostedInvoiceUrl;

  return (
    <View
      className={cn(
        'gap-2 px-6 py-4',
        !isMobile && 'flex-row items-center justify-between gap-4',
        !isLast && 'border-b border-surface-muted'
      )}
    >
      <View className="flex-1 flex-row items-center gap-3">
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-surface-muted">
          <Receipt size={16} color={iconColor.muted} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-ink">
            {invoice.number || 'Invoice'}
          </Text>
          <Text className="text-xs text-ink-subtle">
            {formatDate(invoice.createdAt)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3 pl-12">
        <InvoiceStatusBadge status={invoice.status} />
        <Text className="text-sm font-semibold text-ink">
          {formatCurrency(invoice.amountCents, invoice.currency)}
        </Text>
        {url ? (
          <Pressable
            onPress={() => void openInBrowser(url)}
            accessibilityRole="link"
            accessibilityLabel={`View invoice ${invoice.number}`}
          >
            <Text className="text-sm font-semibold text-primary-700">View</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function UsageLine({
  label,
  used,
  limit,
  barColor,
}: {
  label: string;
  used: number;
  limit: number | null;
  barColor: string;
}) {
  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-ink-muted">{label}</Text>
        <Text className="text-sm font-bold text-ink">
          {used.toLocaleString('en-US')} / {formatLimit(limit)}
        </Text>
      </View>
      <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <View
          className="h-full rounded-full"
          style={{
            width: `${usagePercent(used, limit)}%`,
            backgroundColor: barColor,
          }}
        />
      </View>
    </View>
  );
}

function InvoiceStatusBadge({ status }: { status: string }) {
  if (status === 'paid') return <Badge variant="success">Paid</Badge>;
  if (status === 'open') return <Badge variant="warning">Open</Badge>;
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '—';
  return <Badge variant="neutral">{label}</Badge>;
}
