import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  Play,
} from 'lucide-react-native';
import { Badge } from '../src/components/ui/Badge';
import { Button } from '../src/components/ui/Button';
import { FadeIn } from '../src/components/ui/FadeIn';
import { Grid } from '../src/components/ui/Grid';
import { iconColor, palette } from '../src/lib/theme';

const CHAPTERS = [
  {
    Icon: BrainCircuit,
    color: iconColor.primary,
    bg: 'bg-brand-100',
    title: '0:45 — Brand Memory',
    description:
      'Watch how to configure the AI to match your specific tone of voice. Upload your brand guidelines and see the AI adapt instantly.',
    bullets: ['Tone calibration sliders', 'Negative keyword lists'],
  },
  {
    Icon: CalendarClock,
    color: '#DB2777',
    bg: 'bg-pink-100',
    title: '1:30 — Auto-Scheduling',
    description:
      'See the "Smart Schedule" feature in action. The agent analyzes your audience activity and fills your calendar automatically.',
    bullets: ['Cross-platform sync', 'Visual calendar drag-and-drop'],
  },
  {
    Icon: BarChart3,
    color: iconColor.success,
    bg: 'bg-emerald-100',
    title: '2:15 — ROI Analytics',
    description:
      "Don't just track likes. Track revenue. We'll show you how to connect your conversion events to social performance.",
    bullets: ['Custom report generation', 'Competitor benchmarking'],
  },
];

export default function WatchDemoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);

  const enterApp = () => router.push('/dashboard');
  const goBack = () => router.push('/');

  return (
    <View className="flex-1 bg-cream" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="pb-8">
        {/* Navigation */}
        <View className="border-b border-slate-100 bg-white px-6 py-3">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={goBack}
              className="flex-row items-center gap-2 active:opacity-70"
            >
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <Bot size={20} color={palette.white} />
              </View>
              <Text className="text-xl font-bold tracking-tight text-brown">
                Agent.ai
              </Text>
            </Pressable>
            <View className="flex-row items-center gap-3">
              <Button variant="ghost" onPress={enterApp}>
                Log in
              </Button>
              <Button onPress={enterApp}>Get Started</Button>
            </View>
          </View>
        </View>

        {/* Hero + player */}
        <View className="bg-brand-900 px-6 pb-20 pt-16">
          <View className="mx-auto mb-12 w-full max-w-4xl items-center">
            <FadeIn className="mb-6">
              <Badge className="border-brand-500 bg-brand-800 px-4 py-1.5">
                <View className="flex-row items-center gap-2">
                  <Play size={12} color={palette.brand[200]} />
                  <Text className="text-sm font-semibold text-brand-200">
                    3-Minute Walkthrough
                  </Text>
                </View>
              </Badge>
            </FadeIn>

            <FadeIn delay={100}>
              <Text className="mb-6 text-center text-3xl font-bold tracking-tight text-white md:text-5xl">
                See how Agent.ai automates{'\n'}
                <Text className="text-brand-400">
                  your entire workflow
                </Text>
              </Text>
            </FadeIn>

            <FadeIn delay={200}>
              <Text className="text-center text-lg text-slate-400 md:text-xl">
                From brand voice calibration to multi-channel scheduling, watch
                how our AI agent handles the heavy lifting.
              </Text>
            </FadeIn>
          </View>

          {/* Player */}
          <FadeIn delay={400}>
            <View className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-brand-700 bg-brand-800">
              <View style={{ aspectRatio: 16 / 9 }}>
                {!isPlaying ? (
                  <>
                    <Image
                      source={{
                        uri: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
                      }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0.4,
                      }}
                      resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/40" />

                    <View className="absolute inset-0 items-center justify-center">
                      <Pressable
                        onPress={() => setIsPlaying(true)}
                        className="h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 active:bg-white/20"
                      >
                        <Play
                          size={36}
                          color={palette.white}
                          fill={palette.white}
                        />
                      </Pressable>
                    </View>

                    <View className="absolute bottom-0 left-0 right-0 flex-row items-end justify-between p-6">
                      <View>
                        <Text className="text-lg font-semibold text-white">
                          Agent.ai Product Tour
                        </Text>
                        <Text className="text-sm text-slate-300">
                          3:24 • 4K Quality
                        </Text>
                      </View>
                      <Badge
                        variant="outline"
                        className="border-white/20 bg-black/20"
                      >
                        <Text className="text-xs font-semibold text-white">
                          Updated for 2026
                        </Text>
                      </Badge>
                    </View>
                  </>
                ) : (
                  <View className="absolute inset-0 items-center justify-center bg-black">
                    <View className="h-16 w-16 rounded-full border-4 border-brand-500 border-t-transparent" />
                    <Text className="mt-4 text-slate-400">
                      Loading demo stream...
                    </Text>
                    <Button
                      variant="ghost"
                      className="mt-4"
                      textClassName="text-white"
                      onPress={() => setIsPlaying(false)}
                    >
                      Cancel
                    </Button>
                  </View>
                )}
              </View>
            </View>
          </FadeIn>
        </View>

        {/* Chapters */}
        <View className="bg-white px-6 py-20">
          <Grid columns={3} gutter={32}>
            {CHAPTERS.map(({ Icon, color, bg, title, description, bullets }) => (
              <View key={title} className="gap-6">
                <View
                  className={`h-12 w-12 items-center justify-center rounded-xl ${bg}`}
                >
                  <Icon size={24} color={color} />
                </View>
                <Text className="text-xl font-bold text-brown">{title}</Text>
                <Text className="leading-relaxed text-slate-600">
                  {description}
                </Text>
                <View className="gap-3">
                  {bullets.map((bullet) => (
                    <View key={bullet} className="flex-row items-center gap-2">
                      <CheckCircle2 size={16} color={iconColor.success} />
                      <Text className="text-sm text-slate-600">{bullet}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </Grid>
        </View>

        {/* CTA */}
        <View className="border-t border-slate-200 bg-cream px-6 py-20">
          <View className="mx-auto w-full max-w-4xl items-center">
            <Text className="mb-6 text-center text-3xl font-bold text-brown md:text-4xl">
              Ready to try it yourself?
            </Text>
            <Text className="mb-10 text-center text-lg text-slate-600">
              Get full access to all features shown in the demo. No credit card
              required for the 14-day trial.
            </Text>
            <View className="w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight size={20} color={palette.white} />}
                onPress={enterApp}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-white sm:w-auto"
                onPress={goBack}
              >
                Back to Homepage
              </Button>
            </View>
            <View className="mt-8 flex-row flex-wrap items-center justify-center gap-6">
              {['Setup in 2 minutes', 'Cancel anytime'].map((label) => (
                <View key={label} className="flex-row items-center gap-2">
                  <CheckCircle2 size={16} color={iconColor.success} />
                  <Text className="text-sm text-slate-500">{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="border-t border-slate-100 bg-white px-6 py-12">
          <View className="flex-col items-center justify-between gap-6 md:flex-row">
            <View className="flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <Bot size={20} color={palette.white} />
              </View>
              <Text className="text-xl font-bold tracking-tight text-brown">
                Agent.ai
              </Text>
            </View>
            <Text className="text-sm text-slate-500">
              © 2026 Agent.ai Inc. All rights reserved.
            </Text>
            <View className="flex-row gap-6">
              {['Privacy', 'Terms', 'Contact'].map((link) => (
                <Text key={link} className="text-sm text-slate-500">
                  {link}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
