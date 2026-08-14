import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Tabs } from '../components/ui/Tabs';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Globe,
  Camera,
  Shield,
  Bell,
  Key,
  Smartphone,
  Twitter,
  Instagram,
  Linkedin,
  Link2,
  Check,
  ExternalLink,
  Clock,
  MapPin,
  Pencil } from
'lucide-react';
const connectedPlatforms = [
{
  name: 'Twitter / X',
  icon: Twitter,
  connected: true,
  handle: '@alexmorgan_ai',
  followers: '4,280',
  color: 'text-sky-500',
  bg: 'bg-sky-50'
},
{
  name: 'Instagram',
  icon: Instagram,
  connected: true,
  handle: '@agentai.official',
  followers: '12.1k',
  color: 'text-pink-600',
  bg: 'bg-pink-50'
},
{
  name: 'LinkedIn',
  icon: Linkedin,
  connected: true,
  handle: 'Alex Morgan',
  followers: '8,940',
  color: 'text-blue-700',
  bg: 'bg-blue-50'
}];

const activityLog = [
{
  action: 'Approved 3 LinkedIn posts',
  time: '2 hours ago',
  type: 'approval'
},
{
  action: 'Updated brand voice settings',
  time: '5 hours ago',
  type: 'settings'
},
{
  action: 'Created new goal: Q1 Growth',
  time: '1 day ago',
  type: 'goal'
},
{
  action: 'Rejected Instagram carousel draft',
  time: '1 day ago',
  type: 'rejection'
},
{
  action: 'Connected Twitter account',
  time: '3 days ago',
  type: 'connection'
},
{
  action: 'Invited Sarah to workspace',
  time: '5 days ago',
  type: 'team'
}];

export const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>
        
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-brand-500 via-brand-700 to-brand-900 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          </div>
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="relative group">
                <div className="h-24 w-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Alex Morgan"
                    className="h-full w-full object-cover" />
                  
                </div>
                <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg hover:bg-brand-700 transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-brown">
                    Alex Morgan
                  </h2>
                  <Badge variant="default" className="text-[10px]">
                    Pro
                  </Badge>
                </div>
                <p className="text-slate-500 flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Building2 size={14} /> Acme Corp
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> San Francisco, CA
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> PST (UTC-8)
                  </span>
                </p>
              </div>
              <Button
                variant={isEditing ? 'primary' : 'secondary'}
                leftIcon={
                isEditing ? <Check size={16} /> : <Pencil size={16} />
                }
                onClick={() => setIsEditing(!isEditing)}>
                
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
        {
          id: 'general',
          label: 'General'
        },
        {
          id: 'platforms',
          label: 'Connected Platforms'
        },
        {
          id: 'notifications',
          label: 'Notifications'
        },
        {
          id: 'security',
          label: 'Security'
        }]
        } />
      

      {/* General Tab */}
      {activeTab === 'general' &&
      <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={18} className="text-slate-400" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                  label="First Name"
                  defaultValue="Alex"
                  disabled={!isEditing} />
                
                  <Input
                  label="Last Name"
                  defaultValue="Morgan"
                  disabled={!isEditing} />
                
                  <Input
                  label="Email"
                  defaultValue="alex@acmecorp.com"
                  type="email"
                  disabled={!isEditing} />
                
                  <Input
                  label="Phone"
                  defaultValue="+1 (555) 123-4567"
                  disabled={!isEditing} />
                
                  <Input
                  label="Company"
                  defaultValue="Acme Corp"
                  disabled={!isEditing} />
                
                  <Input
                  label="Role"
                  defaultValue="Growth Lead"
                  disabled={!isEditing} />
                
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe size={18} className="text-slate-400" />
                  Bio & Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                label="Bio"
                defaultValue="Growth Lead at Acme Corp. Passionate about leveraging AI to scale social media presence. Building the future of automated marketing."
                disabled={!isEditing}
                className="min-h-[80px]" />
              
                <Input
                label="Website"
                defaultValue="https://alexmorgan.dev"
                disabled={!isEditing} />
              
              </CardContent>
            </Card>
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                {
                  label: 'Posts Approved',
                  value: '342',
                  period: 'All time'
                },
                {
                  label: 'Goals Completed',
                  value: '18',
                  period: 'This year'
                },
                {
                  label: 'Avg. Response Time',
                  value: '2.4h',
                  period: 'Last 30 days'
                },
                {
                  label: 'Team Members',
                  value: '3',
                  period: 'Active'
                }].
                map((stat, i) =>
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  
                      <div>
                        <p className="text-sm font-medium text-brown">
                          {stat.value}
                        </p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-cream px-2 py-0.5 rounded-full">
                        {stat.period}
                      </span>
                    </div>
                )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {activityLog.slice(0, 5).map((item, i) =>
                <div key={i} className="px-6 py-3 flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-brand-400 shrink-0" />
                      <div>
                        <p className="text-sm text-slate-700">{item.action}</p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </div>
                    </div>
                )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      }

      {/* Connected Platforms Tab */}
      {activeTab === 'platforms' &&
      <div className="space-y-4">
          {connectedPlatforms.map((platform, i) =>
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: i * 0.08
          }}>
          
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                    className={`h-12 w-12 rounded-xl ${platform.bg} flex items-center justify-center`}>
                    
                        <platform.icon size={22} className={platform.color} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-brown">
                            {platform.name}
                          </h4>
                          <Badge variant="success" className="text-[10px]">
                            Connected
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {platform.handle} · {platform.followers} followers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<ExternalLink size={14} />}>
                    
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        )}

          <Card className="border-dashed cursor-pointer hover:bg-cream transition-colors">
            <CardContent className="p-5 flex items-center justify-center gap-3 py-8">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Link2 size={20} />
              </div>
              <div>
                <p className="font-medium text-brown">
                  Connect Another Platform
                </p>
                <p className="text-sm text-slate-500">
                  Facebook, TikTok, Pinterest, and more
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      }

      {/* Notifications Tab */}
      {activeTab === 'notifications' &&
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={18} className="text-slate-400" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how and when you want to be notified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[
            {
              label: 'Content ready for approval',
              description: 'When the AI finishes drafting content',
              enabled: true
            },
            {
              label: 'Post published',
              description: 'When approved content goes live',
              enabled: true
            },
            {
              label: 'Goal milestones',
              description: 'When a goal reaches 25%, 50%, 75%, 100%',
              enabled: true
            },
            {
              label: 'Weekly performance digest',
              description: 'Summary of your social media metrics',
              enabled: false
            },
            {
              label: 'AI optimization suggestions',
              description: 'When the agent identifies improvements',
              enabled: true
            },
            {
              label: 'Team activity',
              description: 'When team members approve or reject content',
              enabled: false
            },
            {
              label: 'Billing & usage alerts',
              description: 'When approaching plan limits',
              enabled: true
            }].
            map((pref, i) =>
            <div
              key={i}
              className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
              
                  <div>
                    <p className="text-sm font-medium text-brown">
                      {pref.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {pref.description}
                    </p>
                  </div>
                  <button
                className={`relative h-6 w-11 rounded-full transition-colors ${pref.enabled ? 'bg-brand-600' : 'bg-slate-200'}`}>
                
                    <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${pref.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                
                  </button>
                </div>
            )}
            </div>
          </CardContent>
        </Card>
      }

      {/* Security Tab */}
      {activeTab === 'security' &&
      <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key size={18} className="text-slate-400" />
                Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-cream rounded-lg border border-slate-100">
                <div>
                  <p className="text-sm font-medium text-brown">
                    Password last changed
                  </p>
                  <p className="text-xs text-slate-500">December 15, 2025</p>
                </div>
                <Button variant="secondary" size="sm">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={18} className="text-slate-400" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Smartphone size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brown">
                      Authenticator App
                    </p>
                    <p className="text-xs text-emerald-600">
                      Enabled · Last verified 3 days ago
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {[
            {
              device: 'MacBook Pro — Chrome',
              location: 'San Francisco, CA',
              current: true,
              time: 'Now'
            },
            {
              device: 'iPhone 15 — Safari',
              location: 'San Francisco, CA',
              current: false,
              time: '2 hours ago'
            }].
            map((session, i) =>
            <div
              key={i}
              className="flex items-center justify-between px-6 py-4 border-b border-slate-100 last:border-0">
              
                  <div className="flex items-center gap-3">
                    <div
                  className={`h-2 w-2 rounded-full ${session.current ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                
                    <div>
                      <p className="text-sm font-medium text-brown">
                        {session.device}
                      </p>
                      <p className="text-xs text-slate-500">
                        {session.location} · {session.time}
                      </p>
                    </div>
                  </div>
                  {session.current ?
              <Badge variant="success" className="text-[10px]">
                      Current
                    </Badge> :

              <Button
                variant="ghost"
                size="sm"
                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                
                      Revoke
                    </Button>
              }
                </div>
            )}
            </CardContent>
          </Card>
        </div>
      }
    </div>);

};