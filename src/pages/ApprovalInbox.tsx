import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Check,
  X,
  Edit3,
  RefreshCw,
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Clock,
  Sparkles } from
'lucide-react';
import { ContentItem } from '../types';
// Mock Data
const initialContent: ContentItem[] = [
{
  id: '1',
  platform: 'twitter',
  content:
  "🚀 AI is changing how we work, but it's not replacing creativity. It's amplifying it. Here are 3 ways to use AI as your creative partner, not your replacement. 🧵👇 #AI #Creativity #FutureOfWork",
  reasoning:
  'Aligns with "Thought Leadership" goal. Uses trending hashtags and thread format for higher engagement.',
  scheduledTime: 'Tomorrow, 9:00 AM',
  status: 'pending',
  author: 'Agent'
},
{
  id: '2',
  platform: 'linkedin',
  content:
  'Excited to announce our new integration with Slack! Now you can manage your social approvals directly from your team channels. \n\nProductivity just got a major upgrade. 📈\n\nCheck out the link in comments to learn more.',
  image:
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  reasoning:
  'Product launch announcement. Professional tone matched to LinkedIn audience.',
  scheduledTime: 'Wed, 2:00 PM',
  status: 'pending',
  author: 'Agent'
},
{
  id: '3',
  platform: 'instagram',
  content:
  'Behind the scenes at our annual retreat! 🌲✨ \n\nBuilding the future of social media management takes a village (and some fresh air). \n\n#CompanyCulture #Startuplife #TeamBuilding',
  image:
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  reasoning:
  'Humanizing the brand. Visual content performs best on Instagram.',
  scheduledTime: 'Fri, 5:00 PM',
  status: 'pending',
  author: 'Agent'
},
{
  id: '4',
  platform: 'email',
  content:
  'Subject: Your Weekly Social Performance Report 📊\n\nHi Team,\n\nHere are the key highlights from last week\'s social media performance:\n\n- Total Reach: +15%\n- Engagement Rate: 4.2%\n- Top Post: "5 Tips for Better Copywriting"\n\nRead the full report in your dashboard.',
  reasoning: 'Weekly stakeholder update email. Concise and data-driven.',
  scheduledTime: 'Mon, 8:00 AM',
  status: 'pending',
  author: 'Agent'
}];

const PlatformIcon = ({ platform }: {platform: string;}) => {
  switch (platform) {
    case 'twitter':
      return <Twitter className="text-sky-500" size={20} />;
    case 'instagram':
      return <Instagram className="text-pink-600" size={20} />;
    case 'linkedin':
      return <Linkedin className="text-blue-700" size={20} />;
    case 'email':
      return <Mail className="text-slate-500" size={20} />;
    default:
      return <MessageSquare size={20} />;
  }
};
export const ApprovalInbox = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [items, setItems] = useState(initialContent);
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(
    null
  );
  const [scheduleOpen, setScheduleOpen] = useState<string | null>(null);
  const [scheduleValues, setScheduleValues] = useState<
    Record<
      string,
      {
        date: string;
        time: string;
      }>>(

    {});
  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setItems(
      items.map((item) =>
      item.id === id ?
      {
        ...item,
        status: action === 'approve' ? 'approved' : 'rejected'
      } :
      item
      )
    );
  };
  const handleScheduleChange = (
  id: string,
  field: 'date' | 'time',
  value: string) =>
  {
    setScheduleValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };
  const filteredItems =
  activeTab === 'all' ?
  items.filter((i) => i.status === 'pending') :
  items.filter((i) => i.platform === activeTab && i.status === 'pending');
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brown">Approval Inbox</h2>
          <p className="text-slate-500">
            Review and manage AI-generated content before it goes live.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<RefreshCw size={16} />}>
            Regenerate All
          </Button>
          <Button>Approve All Selected</Button>
        </div>
      </div>

      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
        {
          id: 'all',
          label: 'All Pending',
          count: items.filter((i) => i.status === 'pending').length
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
        }]
        } />
      

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ?
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="flex flex-col items-center justify-center py-16 text-center bg-cream rounded-xl border border-dashed border-slate-300">
            
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-medium text-brown">
                All caught up!
              </h3>
              <p className="text-slate-500 max-w-sm mt-2">
                No pending items for review. Great job clearing the queue.
              </p>
            </motion.div> :

          filteredItems.map((item) =>
          <motion.div
            key={item.id}
            layout
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            transition={{
              duration: 0.2
            }}>
            
                <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row">
                    {/* Content Preview */}
                    <div className="flex-1 p-6 border-r border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-cream rounded-lg border border-slate-100">
                            <PlatformIcon platform={item.platform} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-brown capitalize">
                              {item.platform}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Calendar size={12} /> {item.scheduledTime}
                            </p>
                          </div>
                        </div>
                        <Badge
                      variant="secondary"
                      className="bg-brand-50 text-brand-700 border-brand-100">
                      
                          AI Draft
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <p className="text-brand-800 whitespace-pre-wrap font-medium leading-relaxed">
                          {item.content}
                        </p>
                        {item.image &&
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            <img
                        src={item.image}
                        alt="Post preview"
                        className="object-cover w-full h-full" />
                      
                          </div>
                    }
                      </div>
                    </div>

                    {/* Sidebar / Actions */}
                    <div className="w-full md:w-72 bg-cream/50 flex flex-col">
                      <div className="p-3 flex-1">
                        <button
                      onClick={() =>
                      setExpandedReasoning(
                        expandedReasoning === item.id ? null : item.id
                      )
                      }
                      className="w-full text-left">
                      
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              AI Reasoning
                            </span>
                            {expandedReasoning === item.id ?
                        <ChevronUp size={12} className="text-slate-400" /> :

                        <ChevronDown
                          size={12}
                          className="text-slate-400" />

                        }
                          </div>
                          <div
                        className={`text-xs text-slate-600 bg-white p-2.5 rounded-md border border-slate-200 ${expandedReasoning === item.id ? '' : 'line-clamp-2'}`}>
                        
                            {item.reasoning}
                          </div>
                        </button>

                        <div className="mt-4 flex items-center gap-3">
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide shrink-0">
                            Tone
                          </span>
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            92
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 bg-white">
                        <div className="p-3 grid grid-cols-2 gap-2">
                          <Button
                        variant="danger"
                        size="sm"
                        className="w-full justify-center"
                        leftIcon={<X size={14} />}
                        onClick={() => handleAction(item.id, 'reject')}>
                        
                            Reject
                          </Button>
                          <Button
                        variant="primary"
                        size="sm"
                        className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white"
                        leftIcon={<Check size={14} />}
                        onClick={() => handleAction(item.id, 'approve')}>
                        
                            Approve
                          </Button>
                        </div>

                        <div className="px-3 pb-3 flex items-center gap-1">
                          <button
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-brown transition-colors"
                        title="Edit content">
                        
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>
                          <div className="w-px h-4 bg-slate-200" />
                          <button
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-brown transition-colors"
                        title="Recreate with AI">
                        
                            <Sparkles size={13} />
                            <span>Recreate</span>
                          </button>
                          <div className="w-px h-4 bg-slate-200" />
                          <button
                        onClick={() =>
                        setScheduleOpen(
                          scheduleOpen === item.id ? null : item.id
                        )
                        }
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${scheduleOpen === item.id ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-brown'}`}
                        title="Reschedule">
                        
                            <Clock size={13} />
                            <span>Schedule</span>
                          </button>
                        </div>

                        <AnimatePresence>
                          {scheduleOpen === item.id &&
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0
                        }}
                        animate={{
                          opacity: 1,
                          height: 'auto'
                        }}
                        exit={{
                          opacity: 0,
                          height: 0
                        }}
                        transition={{
                          duration: 0.15
                        }}
                        className="overflow-hidden">
                        
                              <div className="px-3 pb-3 space-y-2">
                                <div className="flex gap-2">
                                  <div className="flex-1 relative">
                                    <Calendar
                                size={13}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              
                                    <input
                                type="date"
                                value={
                                scheduleValues[item.id]?.date || ''
                                }
                                onChange={(e) =>
                                handleScheduleChange(
                                  item.id,
                                  'date',
                                  e.target.value
                                )
                                }
                                className="w-full h-8 pl-8 pr-2 rounded-md border border-slate-200 bg-white text-xs text-brown outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                              
                                  </div>
                                  <div className="w-28 relative">
                                    <Clock
                                size={13}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              
                                    <input
                                type="time"
                                value={
                                scheduleValues[item.id]?.time || ''
                                }
                                onChange={(e) =>
                                handleScheduleChange(
                                  item.id,
                                  'time',
                                  e.target.value
                                )
                                }
                                className="w-full h-8 pl-8 pr-2 rounded-md border border-slate-200 bg-white text-xs text-brown outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                              
                                  </div>
                                </div>
                                <button
                            onClick={() => setScheduleOpen(null)}
                            className="w-full h-7 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium transition-colors">
                            
                                  Update Schedule
                                </button>
                              </div>
                            </motion.div>
                      }
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
          )
          }
        </AnimatePresence>
      </div>
    </div>);

};