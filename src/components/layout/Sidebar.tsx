import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  CheckSquare,
  BrainCircuit,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Sparkles,
  Zap,
  Crown,
  ChevronsUpDown,
  CalendarClock } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}
export const Sidebar = ({
  activePage,
  onNavigate,
  isCollapsed,
  toggleCollapse
}: SidebarProps) => {
  const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    id: 'approval',
    label: 'Approval Inbox',
    icon: CheckSquare,
    badge: 5
  },
  {
    id: 'scheduler',
    label: 'Scheduler',
    icon: CalendarClock,
    badge: 10
  },
  {
    id: 'memory',
    label: 'Brand Memory',
    icon: BrainCircuit
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3
  }];

  const usagePercent = 71; // 142/200
  return (
    <motion.aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-brand-900 text-slate-300 transition-all duration-300 ease-in-out flex flex-col border-r border-brand-800',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 256
      }}>
      
      {/* Logo Area */}
      <div className="flex h-14 items-center px-5 border-b border-brand-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Bot size={18} />
          </div>
          <AnimatePresence>
            {!isCollapsed &&
            <motion.span
              initial={{
                opacity: 0,
                width: 0
              }}
              animate={{
                opacity: 1,
                width: 'auto'
              }}
              exit={{
                opacity: 0,
                width: 0
              }}
              className="font-bold text-white text-lg tracking-tight whitespace-nowrap overflow-hidden">
              
                Agent.ai
              </motion.span>
            }
          </AnimatePresence>
        </div>
      </div>

      {/* User Profile Section */}
      <div
        className={cn(
          'border-b border-brand-800 shrink-0',
          isCollapsed ? 'px-3 py-4' : 'px-4 py-4'
        )}>
        
        {isCollapsed ?
        <button
          className="flex justify-center w-full"
          onClick={() => onNavigate('profile')}>
          
            <Avatar
            fallback="AM"
            size="sm"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
          
          </button> :

        <button
          onClick={() => onNavigate('profile')}
          className="w-full flex items-center gap-3 rounded-lg bg-brand-800/60 p-3 hover:bg-brand-800 transition-colors text-left">
          
            <Avatar
            fallback="AM"
            size="sm"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
          
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Alex Morgan
              </p>
              <p className="text-xs text-slate-400 truncate">Growth Lead</p>
            </div>
            <div className="shrink-0 rounded-md p-1 text-slate-400">
              <ChevronsUpDown size={14} />
            </div>
          </button>
        }
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <p
          className={cn(
            'text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2',
            isCollapsed ? 'text-center' : 'px-3'
          )}>
          
          {isCollapsed ? '•••' : 'Main Menu'}
        </p>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative',
                isActive ?
                'bg-brand-600/10 text-brand-300' :
                'text-slate-400 hover:bg-brand-800 hover:text-white'
              )}>
              
              <item.icon
                className={cn(
                  'shrink-0',
                  isActive ?
                  'text-brand-300' :
                  'text-slate-400 group-hover:text-white'
                )}
                size={20} />
              

              <AnimatePresence>
                {!isCollapsed &&
                <motion.span
                  initial={{
                    opacity: 0,
                    width: 0
                  }}
                  animate={{
                    opacity: 1,
                    width: 'auto'
                  }}
                  exit={{
                    opacity: 0,
                    width: 0
                  }}
                  className="ml-3 flex-1 text-left whitespace-nowrap overflow-hidden">
                  
                    {item.label}
                  </motion.span>
                }
              </AnimatePresence>

              {!isCollapsed && item.badge &&
              <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-medium text-white">
                  {item.badge}
                </span>
              }

              {isCollapsed && item.badge &&
              <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white ring-2 ring-brand-900">
                  {item.badge}
                </span>
              }

              {isActive &&
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-brand-500" />
              }
            </button>);

        })}
      </nav>

      {/* Pricing Plan Section */}
      <div
        className={cn(
          'border-t border-brand-800 shrink-0',
          isCollapsed ? 'px-3 py-4' : 'px-4 py-4'
        )}>
        
        {isCollapsed ?
        <button
          onClick={() => onNavigate('pricing')}
          className="flex flex-col items-center gap-3 w-full">
          
            <div className="relative">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center hover:from-amber-400 hover:to-orange-500 transition-all">
                <Crown size={16} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-brand-900 flex items-center justify-center">
                <Zap size={8} className="text-white" />
              </div>
            </div>
          </button> :

        <div className="rounded-xl bg-gradient-to-br from-brand-800 to-brand-800/50 p-4 border border-brand-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Crown size={12} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">Pro Plan</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            {/* Usage Bar */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Posts used</span>
                <span className="text-slate-300 font-medium">142 / 200</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-brand-700 overflow-hidden">
                <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
                style={{
                  width: `${usagePercent}%`
                }} />
              
              </div>
            </div>

            <div className="flex justify-between text-xs mb-4">
              <span className="text-slate-400">AI Credits</span>
              <span className="text-slate-300 font-medium">8,420 left</span>
            </div>

            <button
            onClick={() => onNavigate('pricing')}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold py-2.5 transition-colors">
            
              <Sparkles size={14} />
              Upgrade to Enterprise
            </button>

            <p className="text-[10px] text-slate-500 text-center mt-2">
              Renews in 18 days
            </p>
          </div>
        }
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-brand-800 p-3 shrink-0">
        <button className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-brand-800 hover:text-white transition-colors">
          <Settings size={18} />
          <AnimatePresence>
            {!isCollapsed &&
            <motion.span
              initial={{
                opacity: 0,
                width: 0
              }}
              animate={{
                opacity: 1,
                width: 'auto'
              }}
              exit={{
                opacity: 0,
                width: 0
              }}
              className="ml-3 whitespace-nowrap overflow-hidden">
              
                Settings
              </motion.span>
            }
          </AnimatePresence>
        </button>

        <button
          onClick={toggleCollapse}
          className="mt-1 flex w-full items-center justify-center rounded-lg border border-brand-700/50 p-2 text-slate-500 hover:bg-brand-800 hover:text-white transition-colors">
          
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>);

};