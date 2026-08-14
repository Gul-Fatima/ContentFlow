import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  FileCheck,
  Send,
  TrendingUp,
  MessageSquare,
  Settings,
  CheckCircle2,
  Bell } from
'lucide-react';
type NotificationType = 'approval' | 'published' | 'goal' | 'comment' | 'system';
interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
}
const INITIAL_NOTIFICATIONS: Notification[] = [
{
  id: '1',
  title: 'Content Ready for Approval',
  description:
  'AI generated 3 new Instagram posts for the upcoming summer campaign. Please review and approve them before Friday.',
  time: '2m ago',
  read: false,
  type: 'approval'
},
{
  id: '2',
  title: 'Post Published Successfully',
  description:
  'Your scheduled thread about AI trends just went live on Twitter. Initial engagement is looking good!',
  time: '1h ago',
  read: false,
  type: 'published'
},
{
  id: '3',
  title: 'Weekly Goal Reached! 🎉',
  description:
  'Engagement is up 12% this week, surpassing your target of 10%. Keep up the great work!',
  time: '3h ago',
  read: true,
  type: 'goal'
},
{
  id: '4',
  title: 'New Comment Needs Reply',
  description:
  'Sarah Jenkins commented on your recent LinkedIn post: "Great insights on the future of AI in marketing. Have you considered..."',
  time: '5h ago',
  read: true,
  type: 'comment'
},
{
  id: '5',
  title: 'Brand Voice Updated',
  description:
  'Alex Morgan updated the primary brand voice guidelines. All new AI generations will now use the "Professional yet conversational" tone.',
  time: '1d ago',
  read: true,
  type: 'system'
}];

type FilterTab =
'all' |
'unread' |
'approval' |
'published' |
'goal' |
'comment' |
'system';
export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({
        ...n,
        read: true
      }))
    );
  };
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
      n.id === id ?
      {
        ...n,
        read: true
      } :
      n
      )
    );
  };
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.type === activeTab;
  });
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'approval':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <FileCheck className="h-5 w-5" />
          </div>);

      case 'published':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Send className="h-5 w-5" />
          </div>);

      case 'goal':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <TrendingUp className="h-5 w-5" />
          </div>);

      case 'comment':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <MessageSquare className="h-5 w-5" />
          </div>);

      case 'system':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Settings className="h-5 w-5" />
          </div>);

    }
  };
  const tabs: {
    id: FilterTab;
    label: string;
  }[] = [
  {
    id: 'all',
    label: 'All'
  },
  {
    id: 'unread',
    label: 'Unread'
  },
  {
    id: 'approval',
    label: 'Approvals'
  },
  {
    id: 'published',
    label: 'Published'
  },
  {
    id: 'goal',
    label: 'Goals'
  },
  {
    id: 'comment',
    label: 'Comments'
  },
  {
    id: 'system',
    label: 'System'
  }];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brown">Notifications</h1>
            <p className="text-slate-500 text-sm mt-1">
              You have {unreadCount} unread message
              {unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {unreadCount > 0 &&
        <Button variant="outline" onClick={markAllAsRead} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Mark all as read
          </Button>
        }
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {tabs.map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-brand-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
          
            {tab.label}
            {tab.id === 'unread' && unreadCount > 0 &&
          <span
            className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-600'}`}>
            
                {unreadCount}
              </span>
          }
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ?
        filteredNotifications.map((notification) =>
        <Card
          key={notification.id}
          className={`overflow-hidden transition-all cursor-pointer hover:shadow-md ${!notification.read ? 'bg-brand-50/40 border-brand-100' : 'bg-white'}`}
          onClick={() => markAsRead(notification.id)}>
          
              <div className="p-5 flex gap-4 sm:gap-6">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3
                  className={`text-base ${!notification.read ? 'font-semibold text-brown' : 'font-medium text-brand-800'}`}>
                  
                      {notification.title}
                    </h3>
                    <span className="text-sm text-slate-500 whitespace-nowrap flex-shrink-0">
                      {notification.time}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {notification.description}
                  </p>
                </div>

                {!notification.read &&
            <div className="flex-shrink-0 flex items-center justify-center w-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                  </div>
            }
              </div>
            </Card>
        ) :

        <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-cream/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Bell className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-brown mb-1">
              No notifications found
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              {activeTab === 'all' ?
            "You're all caught up! There are no new notifications at this time." :
            `There are no notifications in the "${tabs.find((t) => t.id === activeTab)?.label}" category.`}
            </p>
            {activeTab !== 'all' &&
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setActiveTab('all')}>
            
                View all notifications
              </Button>
          }
          </div>
        }
      </div>
    </div>);

};