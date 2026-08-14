import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Bell, Search } from 'lucide-react';
interface HeaderProps {
  title: string;
  onNavigate?: (page: string) => void;
}
export const Header = ({ title, onNavigate }: HeaderProps) => {
  // Hardcoded unread count for the indicator since state moved to the page
  const hasUnread = true;
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-brown">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, goals..."
            className="h-9 w-64 rounded-md border border-slate-200 bg-cream pl-9 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
          
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={() => onNavigate?.('notifications')}>
            
            <Bell className="h-5 w-5" />
            {hasUnread &&
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            }
          </Button>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-brown">Alex Morgan</p>
            <p className="text-xs text-slate-500">Growth Lead</p>
          </div>
          <Avatar
            fallback="AM"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
          
        </div>
      </div>
    </header>);

};