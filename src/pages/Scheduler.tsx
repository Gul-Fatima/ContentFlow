import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Eye,
  Edit3,
  Trash2,
  GripVertical,
  Globe,
  Sparkles,
  CalendarClock,
  ArrowRight } from
'lucide-react';
type Platform = 'twitter' | 'instagram' | 'linkedin' | 'email';
interface ScheduledPost {
  id: string;
  platform: Platform;
  content: string;
  time: string;
  day: number; // 0-6 for Mon-Sun
  hour: number; // 0-23
  status: 'scheduled' | 'draft' | 'published' | 'failed';
  goalTag?: string;
}
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekDates = [
'Feb 9',
'Feb 10',
'Feb 11',
'Feb 12',
'Feb 13',
'Feb 14',
'Feb 15'];

const timeSlots = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const platformConfig: Record<
  Platform,
  {
    icon: React.ElementType;
    color: string;
    bg: string;
    label: string;
  }> =
{
  twitter: {
    icon: Twitter,
    color: 'text-sky-500',
    bg: 'bg-sky-50 border-sky-200',
    label: 'Twitter'
  },
  instagram: {
    icon: Instagram,
    color: 'text-pink-600',
    bg: 'bg-pink-50 border-pink-200',
    label: 'Instagram'
  },
  linkedin: {
    icon: Linkedin,
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    label: 'LinkedIn'
  },
  email: {
    icon: Mail,
    color: 'text-slate-600',
    bg: 'bg-cream border-slate-200',
    label: 'Email'
  }
};
const initialPosts: ScheduledPost[] = [
{
  id: '1',
  platform: 'twitter',
  content:
  '🚀 AI is changing how we work. Here are 3 ways to use AI as your creative partner...',
  time: '9:00 AM',
  day: 0,
  hour: 9,
  status: 'scheduled',
  goalTag: 'Thought Leadership'
},
{
  id: '2',
  platform: 'linkedin',
  content:
  'Excited to announce our new Slack integration! Productivity just got a major upgrade. 📈',
  time: '2:00 PM',
  day: 2,
  hour: 14,
  status: 'scheduled',
  goalTag: 'Product Launch'
},
{
  id: '3',
  platform: 'instagram',
  content:
  'Behind the scenes at our annual retreat! 🌲✨ Building the future takes a village...',
  time: '5:00 PM',
  day: 4,
  hour: 17,
  status: 'scheduled',
  goalTag: 'Brand Awareness'
},
{
  id: '4',
  platform: 'email',
  content: 'Subject: Your Weekly Social Performance Report 📊',
  time: '8:00 AM',
  day: 0,
  hour: 8,
  status: 'scheduled',
  goalTag: 'Reporting'
},
{
  id: '5',
  platform: 'twitter',
  content:
  '5 underrated tools every social media manager needs in 2026. Thread 🧵👇',
  time: '11:00 AM',
  day: 1,
  hour: 11,
  status: 'draft'
},
{
  id: '6',
  platform: 'linkedin',
  content:
  'The ROI of AI in marketing: A data-driven breakdown of what actually works...',
  time: '10:00 AM',
  day: 3,
  hour: 10,
  status: 'scheduled',
  goalTag: 'Thought Leadership'
},
{
  id: '7',
  platform: 'instagram',
  content:
  'New feature alert! 🎉 Introducing smart scheduling powered by AI...',
  time: '12:00 PM',
  day: 1,
  hour: 12,
  status: 'draft'
},
{
  id: '8',
  platform: 'twitter',
  content:
  'Hot take: The best social media strategy is the one you can actually maintain consistently.',
  time: '3:00 PM',
  day: 5,
  hour: 15,
  status: 'scheduled'
},
{
  id: '9',
  platform: 'linkedin',
  content:
  "We analyzed 10,000 LinkedIn posts. Here's what the top 1% do differently...",
  time: '9:00 AM',
  day: 4,
  hour: 9,
  status: 'scheduled',
  goalTag: 'Thought Leadership'
},
{
  id: '10',
  platform: 'email',
  content: 'Subject: New Feature: AI-Powered Content Calendar',
  time: '10:00 AM',
  day: 2,
  hour: 10,
  status: 'scheduled',
  goalTag: 'Product Launch'
}];

const bestTimes = [
{
  platform: 'twitter' as Platform,
  day: 'Tuesday',
  time: '10:00 AM',
  reason: 'Peak engagement window'
},
{
  platform: 'linkedin' as Platform,
  day: 'Wednesday',
  time: '8:00 AM',
  reason: 'Professional morning scroll'
},
{
  platform: 'instagram' as Platform,
  day: 'Friday',
  time: '6:00 PM',
  reason: 'Weekend browsing starts'
}];

const formatHour = (h: number) => {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
};
export const Scheduler = () => {
  const [posts] = useState(initialPosts);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
  const filteredPosts =
  activeFilter === 'all' ?
  posts :
  activeFilter === 'drafts' ?
  posts.filter((p) => p.status === 'draft') :
  posts.filter((p) => p.platform === activeFilter);
  const getPostsForSlot = (day: number, hour: number) =>
  filteredPosts.filter((p) => p.day === day && p.hour === hour);
  const upcomingPosts = [...filteredPosts].
  filter((p) => p.status === 'scheduled').
  sort((a, b) => a.day * 24 + a.hour - (b.day * 24 + b.hour)).
  slice(0, 6);
  const postCountByDay = weekDays.map(
    (_, i) => filteredPosts.filter((p) => p.day === i).length
  );
  const totalScheduled = posts.filter((p) => p.status === 'scheduled').length;
  const totalDrafts = posts.filter((p) => p.status === 'draft').length;
  return (
    <div className="p-8 max-w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brown">
            Content Scheduler
          </h2>
          <p className="text-slate-500">
            Plan, schedule, and manage your content calendar across all
            platforms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Sparkles size={16} />}>
            AI Auto-Schedule
          </Button>
          <Button leftIcon={<Plus size={16} />}>New Post</Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          label: 'Scheduled',
          value: totalScheduled,
          color: 'text-brand-600',
          bg: 'bg-brand-50'
        },
        {
          label: 'Drafts',
          value: totalDrafts,
          color: 'text-amber-600',
          bg: 'bg-amber-50'
        },
        {
          label: 'This Week',
          value: posts.length,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50'
        },
        {
          label: 'Best Day',
          value: 'Tuesday',
          color: 'text-brand-600',
          bg: 'bg-brand-50'
        }].
        map((stat, i) =>
        <div
          key={i}
          className={`${stat.bg} rounded-xl px-4 py-3 flex items-center justify-between`}>
          
            <span className="text-sm font-medium text-slate-600">
              {stat.label}
            </span>
            <span className={`text-lg font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        )}
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs
          activeTab={activeFilter}
          onChange={setActiveFilter}
          tabs={[
          {
            id: 'all',
            label: 'All',
            count: posts.length
          },
          {
            id: 'twitter',
            label: 'Twitter'
          },
          {
            id: 'linkedin',
            label: 'LinkedIn'
          },
          {
            id: 'instagram',
            label: 'Instagram'
          },
          {
            id: 'email',
            label: 'Email'
          },
          {
            id: 'drafts',
            label: 'Drafts',
            count: totalDrafts
          }]
          } />
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'week' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-cream'}`}>
              
              <Calendar size={14} className="inline mr-1" /> Week
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-cream'}`}>
              
              <GripVertical size={14} className="inline mr-1" /> List
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendar / List View */}
        <div className="lg:col-span-3">
          {viewMode === 'week' ?
          <Card className="overflow-hidden">
              {/* Week Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-cream/50">
                <button className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <h3 className="text-sm font-semibold text-brown">
                  Feb 9 – Feb 15, 2026
                </h3>
                <button className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-100">
                <div className="p-2" />
                {weekDays.map((day, i) =>
              <div
                key={day}
                className={`p-3 text-center border-l border-slate-100 ${i === 0 ? 'bg-brand-50/50' : ''}`}>
                
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {day}
                    </p>
                    <p
                  className={`text-lg font-bold ${i === 0 ? 'text-brand-600' : 'text-brown'}`}>
                  
                      {weekDates[i].split(' ')[1]}
                    </p>
                    {postCountByDay[i] > 0 &&
                <div className="flex justify-center mt-1">
                        <span className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                          {postCountByDay[i]} post
                          {postCountByDay[i] > 1 ? 's' : ''}
                        </span>
                      </div>
                }
                  </div>
              )}
              </div>

              {/* Time Grid */}
              <div className="max-h-[480px] overflow-y-auto">
                {timeSlots.map((hour) =>
              <div
                key={hour}
                className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-50 min-h-[56px]">
                
                    <div className="px-2 py-1 text-[11px] font-medium text-slate-400 text-right pr-3 pt-2">
                      {formatHour(hour)}
                    </div>
                    {weekDays.map((_, dayIdx) => {
                  const slotPosts = getPostsForSlot(dayIdx, hour);
                  return (
                    <div
                      key={dayIdx}
                      className={`border-l border-slate-50 p-1 relative group ${dayIdx === 0 ? 'bg-brand-50/20' : ''}`}>
                      
                          {slotPosts.map((post) => {
                        const config = platformConfig[post.platform];
                        const Icon = config.icon;
                        return (
                          <motion.button
                            key={post.id}
                            onClick={() =>
                            setSelectedPost(
                              selectedPost === post.id ? null : post.id
                            )
                            }
                            initial={{
                              opacity: 0,
                              scale: 0.9
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1
                            }}
                            className={`w-full text-left rounded-md border px-2 py-1.5 text-[11px] leading-tight transition-shadow hover:shadow-md cursor-pointer ${config.bg} ${selectedPost === post.id ? 'ring-2 ring-brand-400 shadow-md' : ''}`}>
                            
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <Icon size={10} className={config.color} />
                                  <span className="font-semibold text-slate-700 truncate">
                                    {post.time}
                                  </span>
                                  {post.status === 'draft' &&
                              <span className="ml-auto text-[8px] font-bold bg-amber-200 text-amber-700 px-1 rounded">
                                      DRAFT
                                    </span>
                              }
                                </div>
                                <p className="text-slate-600 truncate">
                                  {post.content.slice(0, 40)}...
                                </p>
                              </motion.button>);

                      })}
                          {slotPosts.length === 0 &&
                      <button className="absolute inset-1 rounded-md border border-dashed border-transparent hover:border-slate-200 hover:bg-cream/50 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center">
                              <Plus size={12} className="text-slate-300" />
                            </button>
                      }
                        </div>);

                })}
                  </div>
              )}
              </div>
            </Card> /* List View */ :

          <div className="space-y-3">
              <AnimatePresence>
                {filteredPosts.map((post, i) => {
                const config = platformConfig[post.platform];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={post.id}
                    initial={{
                      opacity: 0,
                      y: 10
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      y: -10
                    }}
                    transition={{
                      delay: i * 0.03
                    }}>
                    
                      <Card
                      className={`hover:shadow-md transition-all cursor-pointer ${selectedPost === post.id ? 'ring-2 ring-brand-200 border-brand-300' : ''}`}
                      onClick={() =>
                      setSelectedPost(
                        selectedPost === post.id ? null : post.id
                      )
                      }>
                      
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div
                            className={`h-10 w-10 rounded-xl ${config.bg} border flex items-center justify-center shrink-0`}>
                            
                              <Icon size={18} className={config.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-brown">
                                  {config.label}
                                </span>
                                <Badge
                                variant={
                                post.status === 'scheduled' ?
                                'success' :
                                'warning'
                                }
                                className="text-[10px]">
                                
                                  {post.status === 'scheduled' ?
                                'Scheduled' :
                                'Draft'}
                                </Badge>
                                {post.goalTag &&
                              <Badge
                                variant="secondary"
                                className="text-[10px]">
                                
                                    {post.goalTag}
                                  </Badge>
                              }
                              </div>
                              <p className="text-sm text-slate-600 truncate">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} /> {weekDays[post.day]},{' '}
                                  {weekDates[post.day]}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={12} /> {post.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0">
                              
                                <Eye size={14} />
                              </Button>
                              <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0">
                              
                                <Edit3 size={14} />
                              </Button>
                              <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                              
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>);

              })}
              </AnimatePresence>
            </div>
          }
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Queue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarClock size={16} className="text-brand-500" />
                Up Next
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {upcomingPosts.slice(0, 5).map((post) => {
                  const config = platformConfig[post.platform];
                  const Icon = config.icon;
                  return (
                    <div
                      key={post.id}
                      className="px-4 py-3 flex items-center gap-3 hover:bg-cream transition-colors cursor-pointer">
                      
                      <div
                        className={`h-8 w-8 rounded-lg ${config.bg} border flex items-center justify-center shrink-0`}>
                        
                        <Icon size={14} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-brown truncate">
                          {post.content.slice(0, 35)}...
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {weekDays[post.day]} · {post.time}
                        </p>
                      </div>
                    </div>);

                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Best Times */}
          <Card className="bg-gradient-to-br from-brand-50 to-brand-100 border-brand-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles size={16} className="text-brand-600" />
                AI Best Times
              </CardTitle>
              <CardDescription className="text-xs">
                Optimal posting windows based on your audience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bestTimes.map((bt, i) => {
                  const config = platformConfig[bt.platform];
                  const Icon = config.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white/70 rounded-lg p-2.5 border border-brand-100/50">
                      
                      <Icon size={16} className={config.color} />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-brown">
                          {bt.day}, {bt.time}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {bt.reason}
                        </p>
                      </div>
                    </div>);

                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-brand-600 hover:bg-brand-100"
                rightIcon={<ArrowRight size={14} />}>
                
                Apply Suggestions
              </Button>
            </CardContent>
          </Card>

          {/* Timezone */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Globe size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-brown">
                    Timezone
                  </p>
                  <p className="text-[11px] text-slate-500">
                    PST (UTC-8) · San Francisco
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

};