import React from 'react';
import { cn } from '../../lib/utils';
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
  'default' |
  'secondary' |
  'success' |
  'warning' |
  'error' |
  'outline';
}
export const Badge = ({
  className,
  variant = 'default',
  ...props
}: BadgeProps) => {
  const variants = {
    default: 'border-transparent bg-brand-600 text-white hover:bg-brand-700',
    secondary:
    'border-transparent bg-slate-100 text-brown hover:bg-slate-200',
    success:
    'border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    warning:
    'border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200',
    error: 'border-transparent bg-rose-100 text-rose-700 hover:bg-rose-200',
    outline: 'text-brown border-slate-200'
  };
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props} />);


};