import { useState } from 'react';
import { Text, View } from 'react-native';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Eye,
  Lightbulb,
  MessageCircle,
  MousePointerClick,
  Share2,
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
import { PageHeader } from '../../src/components/ui/PageHeader';
import { Tabs } from '../../src/components/ui/Tabs';
import { Screen } from '../../src/components/layout/Screen';
import { colors, iconColor } from '../../src/lib/theme';

const RANGES = ['Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Year to Date'];

const kpis = [
  {
    label: 'Total Impressions',
    value: '124.5k',
    change: '+12.5%',
    trend: 'up' as const,
    Icon: Eye,
  },
  {
    label: 'Engagement Rate',
    value: '4.8%',
    change: '+0.8%',
    trend: 'up' as const,
    Icon: MessageCircle,
  },
  {
    label: 'Link Clicks',
    value: '3,240',
    change: '-2.1%',
    trend: 'down' as const,
    Icon: MousePointerClick,
  },
  {
    label: 'Conversions',
    value: '145',
    change: '+18.2%',
    trend: 'up' as const,
    Icon: BarChart3,
  },
];

const BARS = [35, 42, 38, 45, 55, 52, 60, 65, 58, 70, 75, 82];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const topContent = [
  { title: '5 AI Tools for Design', views: '12.5k', platform: 'LinkedIn' },
  { title: 'Remote Work Trends', views: '8.2k', platform: 'Twitter' },
  { title: 'Product Launch Teaser', views: '5.1k', platform: 'Instagram' },
];

export default function AnalyticsScreen() {
  // The web app used a native <select>; RN has no equivalent, so the range
  // picker is a segmented control.
  const [range, setRange] = useState(RANGES[0]);

  return (
    <Screen
      title="Analytics"
      contentClassName="gap-8 p-4 pb-16 md:p-8 md:max-w-7xl"
    >
      <PageHeader
        title="Performance Analytics"
        description="Track your growth and AI optimization impact."
        actions={
          <Button
            variant="secondary"
            leftIcon={<Share2 size={16} color={iconColor.subtle} />}
          >
            Export
          </Button>
        }
      />

      {/* Range picker */}
      <Tabs
        className="-mt-4"
        items={RANGES.map((option) => ({ key: option, label: option }))}
        value={range}
        onChange={setRange}
      />

      {/* KPI cards */}
      <View className="flex-col gap-4 md:flex-row">
        {kpis.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 60} className="flex-1">
            <Card>
              <CardContent>
                <View className="mb-4 flex-row items-center justify-between">
                  <View className="rounded-lg bg-surface-muted p-2">
                    <stat.Icon size={20} color={iconColor.subtle} />
                  </View>
                  <Badge variant={stat.trend === 'up' ? 'success' : 'danger'}>
                    <View className="flex-row items-center gap-1">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight size={12} color={iconColor.success} />
                      ) : (
                        <ArrowDownRight size={12} color={iconColor.danger} />
                      )}
                      <Text
                        className={
                          stat.trend === 'up'
                            ? 'text-xs font-semibold text-success-text'
                            : 'text-xs font-semibold text-danger-text'
                        }
                      >
                        {stat.change}
                      </Text>
                    </View>
                  </Badge>
                </View>
                <View>
                  <Text className="text-sm font-medium text-ink-subtle">
                    {stat.label}
                  </Text>
                  <Text className="text-2xl font-bold text-ink">
                    {stat.value}
                  </Text>
                </View>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </View>

      <View className="flex-col gap-8 lg:flex-row">
        {/* Bar chart */}
        <Card style={{ flex: 2 }}>
          <CardHeader>
            <CardTitle>Audience Growth</CardTitle>
            <CardDescription>
              Follower growth across all connected platforms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="h-[220px] w-full flex-row items-end gap-1 pt-4">
              {BARS.map((h, i) => (
                <View
                  key={i}
                  className="relative flex-1 overflow-hidden rounded-t-sm bg-primary-50"
                >
                  <View
                    className="absolute bottom-0 left-0 right-0 rounded-t-sm bg-primary-600"
                    style={{ height: `${h}%` }}
                  />
                </View>
              ))}
            </View>
            <View className="mt-4 flex-row justify-between">
              {MONTHS.map((month, i) => (
                <Text key={i} className="text-caption text-ink-faint">
                  {month.slice(0, 1)}
                </Text>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* AI insights + top content */}
        <View className="gap-6" style={{ flex: 1 }}>
          <Gradient
            colors={[colors.primary[600], colors.primary[700]]}
            className="rounded-lg border-none p-6 shadow-sm"
          >
            <CardContent>
              <View className="mb-4 flex-row items-center gap-2">
                <Lightbulb size={20} color={colors.chart.c1} />
                <Text className="text-lg font-bold text-white">
                  AI Optimization
                </Text>
              </View>
              <Text className="mb-6 leading-relaxed text-primary-100">
                Based on recent performance, posting educational carousels on
                LinkedIn between 8-10 AM EST is driving 40% higher engagement.
              </Text>
              <Button
                variant="secondary"
                fullWidth
                textClassName="text-primary-600"
              >
                Adjust Schedule
              </Button>
            </CardContent>
          </Gradient>

          <Card padding="none">
            <CardHeader className="px-5 pt-5">
              <CardTitle>Top Content</CardTitle>
            </CardHeader>
            <CardContent>
              {topContent.map((post, i) => (
                <View
                  key={i}
                  className={
                    i === topContent.length - 1
                      ? 'flex-row items-center justify-between p-4'
                      : 'flex-row items-center justify-between border-b border-surface-muted p-4'
                  }
                >
                  <View className="flex-1 pr-3">
                    <Text
                      className="text-sm font-medium text-ink"
                      numberOfLines={1}
                    >
                      {post.title}
                    </Text>
                    <Text className="text-xs text-ink-subtle">
                      {post.platform}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-bold text-ink">
                      {post.views}
                    </Text>
                    <Text className="text-xs text-ink-subtle">views</Text>
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
