import { cn } from '../../lib/utils';
interface AvatarProps {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export const Avatar = ({
  src,
  fallback,
  size = 'md',
  className
}: AvatarProps) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };
  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full bg-slate-100',
          sizes[size]
        )}>
        
        {src ?
        <img
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={fallback} /> :


        <div className="flex h-full w-full items-center justify-center bg-brand-100 font-medium text-brand-700">
            {fallback}
          </div>
        }
      </div>
      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
    </div>);

};