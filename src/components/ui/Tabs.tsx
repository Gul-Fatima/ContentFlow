import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
interface Tab {
  id: string;
  label: string;
  count?: number;
}
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}
export const Tabs = ({ tabs, activeTab, onChange, className }: TabsProps) => {
  return (
    <div
      className={cn('flex space-x-1 rounded-xl bg-slate-100 p-1', className)}>
      
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none',
              isActive ?
              'text-brand-700' :
              'text-slate-600 hover:text-brown'
            )}>
            
            {isActive &&
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white shadow-sm rounded-lg"
              transition={{
                type: 'spring',
                bounce: 0.2,
                duration: 0.6
              }} />

            }
            <span className="relative z-10 flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined &&
              <span
                className={cn(
                  'flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]',
                  isActive ?
                  'bg-brand-100 text-brand-700' :
                  'bg-slate-200 text-slate-600'
                )}>
                
                  {tab.count}
                </span>
              }
            </span>
          </button>);

      })}
    </div>);

};