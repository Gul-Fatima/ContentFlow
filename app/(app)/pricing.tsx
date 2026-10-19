import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  ArrowRight,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  CreditCard,
  Crown,
  Receipt,
  Sparkles,
  Zap,
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
import { Grid } from '../../src/components/ui/Grid';
import { Screen } from '../../src/components/layout/Screen';
import { cn } from '../../src/lib/utils';
import { colors, iconColor, palette } from '../../src/lib/theme';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  Icon: typeof Zap;
  iconBg: string;
  iconColor: string;
  features: PlanFeature[];
  popular?: boolean;
  current?: boolean;
  cta: string;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For freelancers getting started with AI-powered social.',
    price: 29,
    period: '/month',
    Icon: Zap,
    iconBg: 'bg-surface-muted',
    iconColor: iconColor.subtle,
    cta: 'Downgrade',
    features: [
      { text: '1 workspace', included: true },
      { text: '50 AI-generated posts/mo', included: true },
      { text: '2 social platforms', included: true },
      { text: '1,000 AI credits', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Email support', included: true },
      { text: 'Brand memory', included: false },
      { text: 'Team collaboration', included: false },
      { text: 'Custom AI training', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams that need serious automation.',
    price: 79,
    period: '/month',
    Icon: Crown,
    iconBg: 'bg-warning',
    iconColor: palette.white,
    popular: true,
    current: true,
    cta: 'Current Plan',
    features: [
      { text: '5 workspaces', included: true },
      { text: '200 AI-generated posts/mo', included: true },
      { text: 'All social platforms', included: true },
      { text: '10,000 AI credits', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Priority support', included: true },
      { text: 'Brand memory & tone', included: true },
      { text: 'Team collaboration (3 seats)', included: true },
      { text: 'Custom AI training', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For agencies and brands at scale. Unlimited everything.',
    price: 199,
    period: '/month',
    Icon: Building2,
    iconBg: 'bg-primary-600',
    iconColor: palette.white,
    cta: 'Upgrade Now',
    features: [
      { text: 'Unlimited workspaces', included: true },
      { text: 'Unlimited AI posts', included: true },
      { text: 'All social platforms', included: true },
      { text: 'Unlimited AI credits', included: true },
      { text: 'Custom analytics & reports', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Brand memory & tone', included: true },
      { text: 'Unlimited team seats', included: true },
      { text: 'Custom AI model training', included: true },
      { text: 'Full API access & webhooks', included: true },
    ],
  },
];

const billingHistory = [
  { date: 'Jan 1, 2026', amount: '$79.00', status: 'Paid', invoice: '#INV-2026-001' },
  { date: 'Dec 1, 2025', amount: '$79.00', status: 'Paid', invoice: '#INV-2025-012' },
  { date: 'Nov 1, 2025', amount: '$79.00', status: 'Paid', invoice: '#INV-2025-011' },
  { date: 'Oct 1, 2025', amount: '$29.00', status: 'Paid', invoice: '#INV-2025-010' },
];

export default function PricingScreen() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  );
  const isAnnual = billingCycle === 'annual';

  return (
    <Screen title="Pricing & Billing" contentClassName="gap-10 p-4 pb-16 md:p-8">
      {/* Header */}
      <View className="mx-auto w-full max-w-2xl items-center">
        <Badge className="mb-4 px-3 py-1">
          <View className="flex-row items-center gap-1">
            <Sparkles size={12} color={palette.white} />
            <Text className="text-xs font-semibold text-white">Pricing</Text>
          </View>
        </Badge>
        <Text className="mb-3 text-center text-2xl font-bold text-ink md:text-3xl">
          Choose the right plan for your team
        </Text>
        <Text className="text-center text-lg text-ink-subtle">
          Scale your social media presence with AI. All plans include a 14-day
          free trial.
        </Text>

        {/* Billing toggle */}
        <View className="mt-6 flex-row items-center justify-center gap-3">
          <Text
            className={cn(
              'text-sm font-medium',
              !isAnnual ? 'text-ink' : 'text-ink-faint'
            )}
          >
            Monthly
          </Text>
          <Pressable
            onPress={() => setBillingCycle(isAnnual ? 'monthly' : 'annual')}
            className="h-7 w-12 justify-center rounded-full bg-primary-600 px-1"
          >
            <View
              className={cn(
                'h-5 w-5 rounded-full bg-white shadow-sm',
                isAnnual ? 'self-end' : 'self-start'
              )}
            />
          </Pressable>
          <View className="flex-row items-center gap-1.5">
            <Text
              className={cn(
                'text-sm font-medium',
                isAnnual ? 'text-ink' : 'text-ink-faint'
              )}
            >
              Annual
            </Text>
            <View className="rounded-full bg-success-soft px-2 py-0.5">
              <Text className="text-xs font-semibold text-success">
                Save 20%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Plan cards */}
      <Grid columns={3} gutter={24}>
        {plans.map((plan, i) => {
          const price = isAnnual ? Math.round(plan.price * 0.8) : plan.price;
          const Icon = plan.Icon;
          return (
            <FadeIn key={plan.id} delay={i * 100} className="h-full">
              <Card
                className={cn(
                  'relative h-full overflow-hidden',
                  plan.current
                    ? 'border-primary-300 ring-2 ring-primary-100'
                    : 'border-surface-border'
                )}
              >
                {plan.popular && (
                  <View className="absolute right-0 top-0 z-10 rounded-bl-lg bg-primary-600 px-3 py-1">
                    <Text className="text-caption font-bold uppercase tracking-wider text-white">
                      Current Plan
                    </Text>
                  </View>
                )}

                <CardHeader>
                  <View className="mb-2 flex-row items-center gap-3">
                    <View
                      className={cn(
                        'h-10 w-10 items-center justify-center rounded-xl',
                        plan.iconBg
                      )}
                    >
                      <Icon size={20} color={plan.iconColor} />
                    </View>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </View>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* Price */}
                  <View className="mb-6">
                    <View className="flex-row items-baseline gap-1">
                      <Text className="text-4xl font-bold text-ink">
                        ${price}
                      </Text>
                      <Text className="text-sm text-ink-subtle">
                        {plan.period}
                      </Text>
                    </View>
                    {isAnnual && (
                      <Text className="mt-1 text-xs text-success">
                        ${price * 12}/year — saving $
                        {Math.round(plan.price * 12 * 0.2)}/year
                      </Text>
                    )}
                  </View>

                  {/* Features */}
                  <View className="mb-6 flex-1 gap-3">
                    {plan.features.map((feature, j) => (
                      <View key={j} className="flex-row items-start gap-2.5">
                        <View
                          className={cn(
                            'mt-0.5 h-4 w-4 items-center justify-center rounded-full',
                            feature.included ? 'bg-success-soft' : 'bg-surface-muted'
                          )}
                        >
                          <Check
                            size={10}
                            strokeWidth={3}
                            color={
                              feature.included
                                ? iconColor.success
                                : colors.ink.faint
                            }
                          />
                        </View>
                        <Text
                          className={cn(
                            'flex-1 text-sm',
                            feature.included
                              ? 'text-ink-muted'
                              : 'text-ink-faint'
                          )}
                        >
                          {feature.text}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* CTA */}
                  <Button
                    variant={
                      plan.current
                        ? 'secondary'
                        : plan.id === 'enterprise'
                          ? 'primary'
                          : 'outline'
                    }
                    className="w-full"
                    disabled={plan.current}
                    leftIcon={
                      plan.id === 'enterprise' ? (
                        <Sparkles size={16} color={palette.white} />
                      ) : undefined
                    }
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          );
        })}
      </Grid>

      {/* Billing details */}
      <Grid columns={3} gutter={24}>
        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <CreditCard size={18} color={iconColor.muted} />
              <CardTitle className="text-base">Payment Method</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center gap-3 rounded-lg border border-surface-muted bg-surface-page p-3">
              <View className="h-10 w-14 items-center justify-center rounded-md bg-sidebar-card">
                <Text className="text-caption font-bold tracking-wider text-white">
                  VISA
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-ink">
                  •••• •••• •••• 4242
                </Text>
                <Text className="text-xs text-ink-subtle">
                  Expires 08/2027
                </Text>
              </View>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Calendar size={18} color={iconColor.muted} />
              <CardTitle className="text-base">Next Billing Date</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            <View className="rounded-lg border border-surface-muted bg-surface-page p-3">
              <Text className="text-2xl font-bold text-ink">
                Feb 27, 2026
              </Text>
              <Text className="mt-1 text-sm text-ink-subtle">
                Pro Plan — $79.00
              </Text>
              <View className="mt-3 flex-row items-center gap-2">
                <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-border">
                  <View
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: '60%' }}
                  />
                </View>
                <Text className="text-xs text-ink-faint">18 days left</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Zap size={18} color={iconColor.muted} />
              <CardTitle className="text-base">Usage This Period</CardTitle>
            </View>
          </CardHeader>
          <CardContent className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-ink-muted">Posts Generated</Text>
              <Text className="text-sm font-bold text-ink">142 / 200</Text>
            </View>
            <View className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <View
                className="h-full rounded-full bg-primary-500"
                style={{ width: '71%' }}
              />
            </View>
            <View className="flex-row items-center justify-between pt-1">
              <Text className="text-sm text-ink-muted">AI Credits</Text>
              <Text className="text-sm font-bold text-ink">
                8,420 / 10,000
              </Text>
            </View>
            <View className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <View
                className="h-full rounded-full bg-success"
                style={{ width: '84%' }}
              />
            </View>
          </CardContent>
        </Card>
      </Grid>

      {/* Billing history */}
      <Card>
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Receipt size={18} color={iconColor.muted} />
              <CardTitle>Billing History</CardTitle>
            </View>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight size={14} color={iconColor.subtle} />}
            >
              View All
            </Button>
          </View>
        </CardHeader>
        <CardContent className="p-0">
          {billingHistory.map((item, i) => (
            <FadeIn key={item.invoice} delay={i * 50}>
              <View
                className={cn(
                  'flex-row items-center justify-between px-6 py-4',
                  i !== billingHistory.length - 1 &&
                    'border-b border-surface-muted'
                )}
              >
                <View className="flex-1 flex-row items-center gap-4">
                  <View className="h-9 w-9 items-center justify-center rounded-lg bg-surface-muted">
                    <Receipt size={16} color={iconColor.muted} />
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-ink">
                      {item.invoice}
                    </Text>
                    <Text className="text-xs text-ink-subtle">{item.date}</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-4">
                  <Badge variant="success">{item.status}</Badge>
                  <Text className="text-sm font-semibold text-ink">
                    {item.amount}
                  </Text>
                  <ChevronRight size={16} color={colors.ink.faint} />
                </View>
              </View>
            </FadeIn>
          ))}
        </CardContent>
      </Card>
    </Screen>
  );
}
