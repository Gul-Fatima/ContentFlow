import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Textarea';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Plus } from
'lucide-react';
import { Goal, Task } from '../types';
// Mock Data
const activeGoals: Goal[] = [
{
  id: '1',
  title: 'Increase Q3 Brand Awareness',
  progress: 65,
  taskCount: 12,
  status: 'active',
  createdAt: '2023-10-01'
},
{
  id: '2',
  title: 'Launch Product Hunt Campaign',
  progress: 30,
  taskCount: 8,
  status: 'active',
  createdAt: '2023-10-15'
},
{
  id: '3',
  title: 'Grow LinkedIn Followers to 10k',
  progress: 85,
  taskCount: 5,
  status: 'active',
  createdAt: '2023-09-20'
}];

const taskQueue: Task[] = [
{
  id: '1',
  title: 'Draft 5 LinkedIn posts about AI trends',
  reasoning: "Based on high engagement of last week's tech posts",
  status: 'pending',
  goalId: '3'
},
{
  id: '2',
  title: 'Create Instagram carousel for new feature',
  reasoning: 'Visual content needed for product launch goal',
  status: 'in-progress',
  goalId: '2'
},
{
  id: '3',
  title: 'Analyze competitor Q3 performance',
  reasoning: 'Quarterly benchmark required for strategy adjustment',
  status: 'completed',
  goalId: '1'
}];

export const Dashboard = () => {
  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brown">
            Good morning, Alex
          </h2>
          <p className="text-slate-500">
            Here's what's happening with your social strategy today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">View Reports</Button>
          <Button leftIcon={<Sparkles size={16} />}>New Campaign</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
        {
          label: 'Pending Approvals',
          value: '12',
          icon: CheckCircle2,
          color: 'text-amber-600',
          bg: 'bg-amber-100'
        },
        {
          label: 'Scheduled Posts',
          value: '28',
          icon: Calendar,
          color: 'text-brand-600',
          bg: 'bg-brand-100'
        },
        {
          label: 'Weekly Reach',
          value: '45.2k',
          icon: Users,
          color: 'text-emerald-600',
          bg: 'bg-emerald-100'
        },
        {
          label: 'Engagement Rate',
          value: '4.8%',
          icon: TrendingUp,
          color: 'text-rose-600',
          bg: 'bg-rose-100'
        }].
        map((stat, i) =>
        <Card
          key={i}
          className="border-none shadow-sm hover:shadow-md transition-shadow">
          
            <CardContent className="flex items-center p-6">
              <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
              
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-brown">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Goals & Input */}
        <div className="lg:col-span-2 space-y-8">
          {/* Goal Input */}
          <Card className="bg-gradient-to-br from-brand-50 to-white border-brand-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-900">
                <Sparkles className="h-5 w-5 text-brand-600" />
                Set a New Goal
              </CardTitle>
              <CardDescription>
                Describe what you want to achieve. The agent will break it down
                into actionable tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="e.g., Increase our Twitter engagement by 20% this month by focusing on educational threads about AI..."
                  className="min-h-[100px] border-brand-200 focus:border-brand-500 bg-white" />
                
                <div className="flex justify-end">
                  <Button>Generate Plan</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Goals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brown">
                Active Goals
              </h3>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight size={16} />}>
                
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {activeGoals.map((goal) =>
              <motion.div
                key={goal.id}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.3
                }}>
                
                  <Card className="group hover:border-brand-200 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-brown group-hover:text-brand-600 transition-colors">
                            {goal.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            {goal.taskCount} tasks remaining
                          </p>
                        </div>
                        <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-600">
                        
                          Active
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                          className="h-full bg-brand-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${goal.progress}%`
                          }} />
                        
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Task Queue */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-brown">
              Agent Task Queue
            </h3>
            <Badge variant="outline" className="bg-white">
              5 Pending
            </Badge>
          </div>

          <div className="space-y-3">
            {taskQueue.map((task, i) =>
            <motion.div
              key={task.id}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: i * 0.1
              }}>
              
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                      className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${task.status === 'completed' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                    
                      <div className="space-y-2 w-full">
                        <p className="text-sm font-medium text-brown leading-tight">
                          {task.title}
                        </p>
                        <div className="bg-brand-50 rounded-md p-2 text-xs text-brand-700 border border-brand-100">
                          <span className="font-semibold">AI Reasoning:</span>{' '}
                          {task.reasoning}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> 2h ago
                          </span>
                          <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs">
                          
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <Card className="bg-cream border-dashed border-slate-300">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center py-8">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Plus className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-brown">
                Add Manual Task
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Assign a specific task to the agent
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

};