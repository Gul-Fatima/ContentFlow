import { Text, View } from 'react-native';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
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
import { iconTileColor } from '../../src/components/ui/IconTile';
import { Gradient } from '../../src/components/ui/Gradient';
import { PageHeader } from '../../src/components/ui/PageHeader';
import { StatCard } from '../../src/components/ui/StatCard';
import { Textarea } from '../../src/components/ui/Textarea';
import { Screen } from '../../src/components/layout/Screen';
import { colors, iconColor, palette } from '../../src/lib/theme';
import type { Goal, Task } from '../../src/types';

// Mock data — replaced by `GET /api/goals/` and `GET /api/tasks/` when the
// frontend is wired to the Django API.
const activeGoals: Goal[] = [
  {
    id: '1',
    title: 'Increase Q3 Brand Awareness',
    progress: 65,
    taskCount: 12,
    status: 'active',
    createdAt: '2023-10-01',
  },
  {
    id: '2',
    title: 'Launch Product Hunt Campaign',
    progress: 30,
    taskCount: 8,
    status: 'active',
    createdAt: '2023-10-15',
  },
  {
    id: '3',
    title: 'Grow LinkedIn Followers to 10k',
    progress: 85,
    taskCount: 5,
    status: 'active',
    createdAt: '2023-09-20',
  },
];

const taskQueue: Task[] = [
  {
    id: '1',
    title: 'Draft 5 LinkedIn posts about AI trends',
    reasoning: "Based on high engagement of last week's tech posts",
    status: 'pending',
    goalId: '3',
  },
  {
    id: '2',
    title: 'Create Instagram carousel for new feature',
    reasoning: 'Visual content needed for product launch goal',
    status: 'in-progress',
    goalId: '2',
  },
  {
    id: '3',
    title: 'Analyze competitor Q3 performance',
    reasoning: 'Quarterly benchmark required for strategy adjustment',
    status: 'completed',
    goalId: '1',
  },
];

const stats = [
  {
    label: 'Pending Approvals',
    value: '12',
    Icon: CheckCircle2,
    tone: 'warning' as const,
  },
  {
    label: 'Scheduled Posts',
    value: '28',
    Icon: Calendar,
    tone: 'primary' as const,
  },
  {
    label: 'Weekly Reach',
    value: '45.2k',
    Icon: Users,
    tone: 'success' as const,
  },
  {
    label: 'Engagement Rate',
    value: '4.8%',
    Icon: TrendingUp,
    tone: 'danger' as const,
  },
];

function taskDotClass(status: Task['status']) {
  if (status === 'completed') return 'bg-success';
  if (status === 'in-progress') return 'bg-warning';
  return 'bg-surface-border';
}

export default function DashboardScreen() {
  return (
    <Screen title="Dashboard" contentClassName="gap-8 p-4 pb-16 md:p-8">
      {/* Welcome */}
      <PageHeader
        title="Good morning, Alex"
        description="Here's what's happening with your social strategy today."
        actions={
          <>
            <Button variant="secondary">View Reports</Button>
            <Button leftIcon={<Sparkles size={16} color={palette.white} />}>
              New Campaign
            </Button>
          </>
        }
      />

      {/* Quick stats */}
      <View className="flex-col gap-4 md:flex-row">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 60} className="flex-1">
            <StatCard
              label={stat.label}
              value={stat.value}
              tone={stat.tone}
              icon={<stat.Icon size={24} color={iconTileColor(stat.tone)} />}
            />
          </FadeIn>
        ))}
      </View>

      {/* Main content: goals + task queue */}
      <View className="flex-col gap-8 lg:flex-row">
        <View className="gap-8" style={{ flex: 2 }}>
          {/* Goal input */}
          <Gradient
            colors={[colors.primary[50], palette.white]}
            className="rounded-lg border border-primary-100 p-5 shadow-sm"
          >
            <CardHeader>
              <View className="flex-row items-center gap-2">
                <Sparkles size={20} color={iconColor.primary} />
                <CardTitle className="text-ink">Set a New Goal</CardTitle>
              </View>
              <CardDescription>
                Describe what you want to achieve. The agent will break it down
                into actionable tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              <Textarea
                placeholder="e.g., Increase our Twitter engagement by 20% this month by focusing on educational threads about AI..."
                className="min-h-[100px]"
              />
              <View className="flex-row justify-end">
                <Button>Generate Plan</Button>
              </View>
            </CardContent>
          </Gradient>

          {/* Active goals */}
          <View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-ink">
                Active Goals
              </Text>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight size={16} color={iconColor.subtle} />}
              >
                View All
              </Button>
            </View>
            <View className="gap-4">
              {activeGoals.map((goal, i) => (
                <FadeIn key={goal.id} delay={i * 80}>
                  <Card>
                    <CardContent>
                      <View className="mb-4 flex-row items-start justify-between">
                        <View className="flex-1 pr-3">
                          <Text className="font-semibold text-ink">
                            {goal.title}
                          </Text>
                          <Text className="mt-1 text-sm text-ink-subtle">
                            {goal.taskCount} tasks remaining
                          </Text>
                        </View>
                        <Badge variant="neutral">Active</Badge>
                      </View>
                      <View className="gap-2">
                        <View className="flex-row justify-between">
                          <Text className="text-xs text-ink-subtle">Progress</Text>
                          <Text className="text-xs text-ink-subtle">
                            {goal.progress}%
                          </Text>
                        </View>
                        <View className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                          <View
                            className="h-full rounded-full bg-primary-600"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </View>
          </View>
        </View>

        {/* Task queue */}
        <View className="gap-6" style={{ flex: 1 }}>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-ink">
              Agent Task Queue
            </Text>
            <Badge variant="outline">5 Pending</Badge>
          </View>

          <View className="gap-3">
            {taskQueue.map((task, i) => (
              <FadeIn key={task.id} axis="x" delay={i * 100}>
                <Card padding="sm">
                  <CardContent>
                    <View className="flex-row items-start gap-3">
                      <View
                        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${taskDotClass(
                          task.status
                        )}`}
                      />
                      <View className="w-full flex-1 gap-2">
                        <Text className="text-sm font-medium leading-tight text-ink">
                          {task.title}
                        </Text>
                        <View className="rounded-md border border-primary-100 bg-primary-50 p-2">
                          <Text className="text-xs text-primary-700">
                            <Text className="font-semibold">AI Reasoning: </Text>
                            {task.reasoning}
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-between pt-1">
                          <View className="flex-row items-center gap-1">
                            <Clock size={12} color={iconColor.muted} />
                            <Text className="text-xs text-ink-faint">2h ago</Text>
                          </View>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </View>

          <Card
            padding="none"
            className="border-dashed border-surface-border bg-surface-page"
          >
            <CardContent className="items-center justify-center py-8">
              <View className="mb-3 h-10 w-10 items-center justify-center rounded-full bg-surface-muted">
                <Plus size={20} color={iconColor.muted} />
              </View>
              <Text className="text-sm font-medium text-ink">
                Add Manual Task
              </Text>
              <Text className="mt-1 text-xs text-ink-subtle">
                Assign a specific task to the agent
              </Text>
            </CardContent>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
