import { Image, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AtSign,
  ArrowRight,
  BarChart3,
  Bot,
  Box,
  BrainCircuit,
  Briefcase,
  CalendarClock,
  Camera,
  CheckCircle2,
  Circle,
  Hexagon,
  Mail,
  Play,
  Shield,
  Sparkles,
  Star,
  Triangle,
  Users,
  Zap,
} from 'lucide-react-native';
import { Badge } from '../src/components/ui/Badge';
import { Button } from '../src/components/ui/Button';
import { Card, CardContent } from '../src/components/ui/Card';
import { FadeIn } from '../src/components/ui/FadeIn';
import { Grid } from '../src/components/ui/Grid';
import { colors, iconColor, palette, PLATFORM_COLORS } from '../src/lib/theme';
import { ROUTES } from '../src/constants/routes';

const FEATURES = [
  {
    Icon: BrainCircuit,
    color: iconColor.primary,
    title: 'Brand Memory',
    description:
      'The AI learns your unique voice, tone, and style guidelines. It never sounds generic—it sounds like you.',
  },
  {
    Icon: CalendarClock,
    color: PLATFORM_COLORS.instagram,
    title: 'Smart Scheduling',
    description:
      'Automatically identifies the best times to post for your specific audience to maximize engagement.',
  },
  {
    Icon: BarChart3,
    color: iconColor.success,
    title: 'Predictive Analytics',
    description:
      "Don't just see what happened. See what will happen. Forecast trends and adjust strategy in real-time.",
  },
  {
    Icon: Shield,
    color: iconColor.warning,
    title: 'Brand Safety',
    description:
      'Built-in guardrails ensure no content goes out that violates your compliance or brand safety rules.',
  },
  {
    Icon: Users,
    color: colors.accent.link,
    title: 'Collaborative Workflow',
    description:
      'Seamless approval flows for teams. Comment, edit, and approve content in one unified inbox.',
  },
  {
    Icon: Zap,
    color: iconColor.primary,
    title: 'Multi-Channel Repurposing',
    description:
      'Turn one blog post into a Twitter thread, LinkedIn article, and Instagram carousel instantly.',
  },
];

const LOGOS = [
  { label: 'Acme Inc.', Icon: Zap },
  { label: 'Layers', Icon: Box },
  { label: 'Quotient', Icon: Circle },
  { label: 'Sisyphus', Icon: Triangle },
  { label: 'Hourglass', Icon: Hexagon },
];

const COMMAND_CENTER = [
  {
    Icon: CheckCircle2,
    color: colors.chart.c3,
    title: 'Goal-Oriented Planning',
    description:
      'Set high-level goals like "Increase Brand Awareness" and let the AI break it down.',
  },
  {
    Icon: CheckCircle2,
    color: colors.chart.c4,
    title: 'Cross-Platform Sync',
    description:
      'Coordinate campaigns across Twitter, LinkedIn, and Instagram seamlessly.',
  },
  {
    Icon: CheckCircle2,
    color: colors.chart.c2,
    title: 'Real-time ROI Tracking',
    description:
      'Measure the actual business impact of your social media efforts.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Agent.ai has completely transformed our workflow. It's like having a senior social media manager working 24/7.",
    author: 'Sarah Jenkins',
    role: 'CMO at TechFlow',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote:
      'The brand voice consistency is incredible. I was skeptical that AI could sound like us, but it nailed it within a week.',
    author: 'Michael Chen',
    role: 'Head of Growth at ScaleUp',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote:
      "We've seen a 3x increase in engagement since switching to Agent.ai. The predictive analytics are a game changer.",
    author: 'Jessica Williams',
    role: 'Social Lead at CreativeCo',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const FOOTER_COLUMNS = [
  { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
  { title: 'Company', links: ['About', 'Careers', 'Blog', 'Contact'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
];

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const enterApp = () => router.push(ROUTES.signIn);
  const watchDemo = () => router.push(ROUTES.demo);

  return (
    <View className="flex-1 bg-surface-page" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="pb-8">
        {/* Navigation */}
        <View className="border-b border-surface-muted bg-white px-6 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <Bot size={20} color={palette.white} />
              </View>
              <Text className="text-xl font-bold tracking-tight text-ink">
                Agent.ai
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Button variant="ghost" onPress={enterApp}>
                Sign in
              </Button>
              <Button onPress={enterApp}>Get Started</Button>
            </View>
          </View>
        </View>

        {/* Hero */}
        <View className="px-6 py-16 md:py-24">
          <View className="mx-auto w-full max-w-4xl items-center">
            <FadeIn className="mb-6">
              <Badge
                variant="secondary"
                className="border-primary-100/60 bg-primary-50 px-4 py-1.5"
              >
                <View className="flex-row items-center gap-2">
                  <Sparkles size={14} color={colors.ink.DEFAULT} />
                  <Text className="text-sm font-semibold text-ink">
                    Now with GPT-4o Integration
                  </Text>
                </View>
              </Badge>
            </FadeIn>

            <FadeIn delay={100}>
              <Text className="mb-8 text-center text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
                Your AI Social Media{'\n'}
                <Text className="text-primary-600">Marketing Team</Text>
              </Text>
            </FadeIn>

            <FadeIn delay={200}>
              <Text className="mb-10 text-center text-lg leading-relaxed text-ink-muted md:text-xl">
                Stop spending hours on content. Agent.ai learns your brand
                voice, drafts posts, schedules content, and analyzes performance
                — automatically.
              </Text>
            </FadeIn>

            <FadeIn delay={300} className="w-full">
              <View className="flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="w-full rounded-full sm:w-auto"
                  rightIcon={
                    <ArrowRight size={20} color={palette.white} />
                  }
                  onPress={enterApp}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full border-surface-border sm:w-auto"
                  leftIcon={<Play size={20} color={iconColor.primary} />}
                  onPress={watchDemo}
                >
                  Watch Demo
                </Button>
              </View>
            </FadeIn>

            <FadeIn delay={400}>
              <View className="mt-12 flex-row flex-wrap items-center justify-center gap-6">
                {[
                  'No credit card required',
                  '14-day free trial',
                  'Cancel anytime',
                ].map((label) => (
                  <View key={label} className="flex-row items-center gap-2">
                    <CheckCircle2 size={16} color={iconColor.success} />
                    <Text className="text-sm text-ink-subtle">{label}</Text>
                  </View>
                ))}
              </View>
            </FadeIn>
          </View>
        </View>

        {/* Social proof */}
        <View className="border-y border-surface-muted bg-surface-page px-6 py-12">
          <Text className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-ink-subtle">
            Trusted by modern marketing teams
          </Text>
          <View className="flex-row flex-wrap items-center justify-center gap-8 opacity-70">
            {LOGOS.map(({ label, Icon }) => (
              <View key={label} className="flex-row items-center gap-2">
                <Icon size={24} color={iconColor.subtle} />
                <Text className="text-xl font-bold text-ink-subtle">
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features */}
        <View className="bg-white px-6 py-20">
          <View className="mx-auto mb-16 w-full max-w-3xl">
            <Text className="mb-6 text-center text-3xl font-bold text-ink md:text-4xl">
              Superpowers for your social strategy
            </Text>
            <Text className="text-center text-lg text-ink-muted">
              Agent.ai isn&apos;t just a scheduling tool. It&apos;s an
              intelligent partner that understands your goals and executes them
              with precision.
            </Text>
          </View>

          <Grid columns={3} gutter={32}>
            {FEATURES.map(({ Icon, color, title, description }) => (
              <Card key={title} className="border-none bg-surface-page shadow-none">
                <CardContent className="p-8">
                  <View className="mb-6 h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Icon size={28} color={color} />
                  </View>
                  <Text className="mb-3 text-xl font-bold text-ink">
                    {title}
                  </Text>
                  <Text className="leading-relaxed text-ink-muted">
                    {description}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </View>

        {/* Command center */}
        <View className="bg-sidebar px-6 py-20">
          <View className="flex-col gap-12 lg:flex-row lg:items-center">
            <View className="flex-1">
              <Text className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Manage everything from one{'\n'}
                <Text className="text-primary-300">
                  intelligent command center
                </Text>
              </Text>
              <Text className="mb-8 text-lg leading-relaxed text-ink-faint">
                Experience the power of a unified dashboard where goals turn
                into tasks, and tasks turn into results.
              </Text>

              <View className="gap-6">
                {COMMAND_CENTER.map(({ Icon, color, title, description }) => (
                  <View key={title} className="flex-row items-start gap-4">
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-sidebar-card">
                      <Icon size={24} color={color} />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 text-lg font-semibold text-white">
                        {title}
                      </Text>
                      <Text className="text-ink-faint">{description}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View className="mt-10">
                <Button size="lg" onPress={enterApp}>
                  Explore the Dashboard
                </Button>
              </View>
            </View>

            <View className="flex-1">
              <View className="overflow-hidden rounded-xl border border-sidebar-track bg-sidebar-card">
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
                  }}
                  style={{ width: '100%', aspectRatio: 16 / 10 }}
                  resizeMode="cover"
                />
                <View className="px-6 py-4">
                  <View className="flex-row items-center gap-3">
                    <View className="flex-row">
                      <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-primary-500">
                        <Text className="text-xs font-bold text-white">AI</Text>
                      </View>
                      <View className="-ml-2 h-8 w-8 rounded-full border-2 border-ink bg-sidebar-track" />
                      <View className="-ml-2 h-8 w-8 rounded-full border-2 border-ink bg-sidebar-track" />
                    </View>
                    <Text className="text-sm font-medium text-ink-faint">
                      Agent + 2 team members active
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Testimonials */}
        <View className="bg-surface-page px-6 py-20">
          <View className="mb-16">
            <Text className="mb-4 text-center text-3xl font-bold text-ink">
              Loved by marketing teams
            </Text>
            <Text className="text-center text-ink-muted">
              Join 10,000+ marketers who trust Agent.ai
            </Text>
          </View>

          <Grid columns={3} gutter={32}>
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.author} className="border border-surface-muted">
                <CardContent className="p-8">
                  <View className="mb-4 flex-row gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        size={16}
                        color={colors.chart.c3}
                        fill={colors.chart.c3}
                      />
                    ))}
                  </View>
                  <Text className="mb-6 text-lg italic text-ink-muted">
                    &quot;{testimonial.quote}&quot;
                  </Text>
                  <View className="flex-row items-center gap-3">
                    <Image
                      source={{ uri: testimonial.avatar }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                      resizeMode="cover"
                    />
                    <View>
                      <Text className="text-sm font-semibold text-ink">
                        {testimonial.author}
                      </Text>
                      <Text className="text-xs text-ink-subtle">
                        {testimonial.role}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </View>

        {/* CTA */}
        <View className="bg-white px-6 py-20">
          <View className="rounded-3xl bg-primary-600 p-8 md:p-16">
            <Text className="mb-6 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to automate your growth?
            </Text>
            <Text className="mb-10 text-center text-lg text-primary-100">
              Join thousands of brands using Agent.ai to scale their social
              presence without scaling their headcount.
            </Text>
            <View className="flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="w-full bg-white sm:w-auto"
                textClassName="text-primary-600"
                onPress={enterApp}
              >
                Get Started for Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-primary-400 sm:w-auto"
                textClassName="text-white"
              >
                Contact Sales
              </Button>
            </View>
            <Text className="mt-6 text-center text-sm text-primary-100">
              No credit card required · 14-day free trial · Cancel anytime
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="border-t border-surface-muted bg-white px-6 pb-8 pt-16">
          <Grid columns={2} mobileColumns={2} gutter={32}>
            <View className="mb-8">
              <View className="mb-4 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                  <Bot size={20} color={palette.white} />
                </View>
                <Text className="text-xl font-bold tracking-tight text-ink">
                  Agent.ai
                </Text>
              </View>
              <Text className="mb-6 max-w-xs text-sm text-ink-subtle">
                The AI-powered social media management platform for modern
                marketing teams.
              </Text>
              <View className="flex-row gap-4">
                {[
                  { Icon: AtSign, label: 'Twitter' },
                  { Icon: Briefcase, label: 'LinkedIn' },
                  { Icon: Camera, label: 'Instagram' },
                  { Icon: Mail, label: 'Email' },
                ].map(({ Icon, label }) => (
                  <View
                    key={label}
                    className="h-10 w-10 items-center justify-center rounded-full bg-surface-muted"
                    accessibilityLabel={label}
                  >
                    <Icon size={20} color={iconColor.subtle} />
                  </View>
                ))}
              </View>
            </View>

            {FOOTER_COLUMNS.map((column) => (
              <View key={column.title} className="mb-8">
                <Text className="mb-4 font-semibold text-ink">
                  {column.title}
                </Text>
                <View className="gap-2">
                  {column.links.map((link) => (
                    <Text key={link} className="text-sm text-ink-muted">
                      {link}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </Grid>

          <View className="flex-col items-center justify-between gap-4 border-t border-surface-muted pt-8 md:flex-row">
            <Text className="text-sm text-ink-subtle">
              © 2026 Agent.ai Inc. All rights reserved.
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="h-2 w-2 rounded-full bg-success" />
              <Text className="text-sm text-ink-subtle">
                All systems operational
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
