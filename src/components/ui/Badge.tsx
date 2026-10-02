import React from 'react';
import { Text, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface BadgeProps extends ViewProps {
  variant?:
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'outline';
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'border-transparent bg-brand-600',
  secondary: 'border-transparent bg-slate-100',
  success: 'border-transparent bg-emerald-100',
  warning: 'border-transparent bg-amber-100',
  error: 'border-transparent bg-rose-100',
  outline: 'border-slate-200 bg-transparent',
};

const textVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'text-white',
  secondary: 'text-brown',
  success: 'text-emerald-700',
  warning: 'text-amber-700',
  error: 'text-rose-700',
  outline: 'text-brown',
};

export function Badge({
  className,
  textClassName,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  // A `View` can't be nested inside a `Text` on native, so plain strings get
  // the variant text styling and anything else is rendered as-is (callers then
  // own the text colour, e.g. a row with an icon).
  const isPlainText =
    typeof children === 'string' || typeof children === 'number';

  return (
    <View
      className={cn(
        'flex-row items-center self-start rounded-full border px-2.5 py-0.5',
        variants[variant],
        className
      )}
      {...props}
    >
      {isPlainText ? (
        <Text
          className={cn(
            'text-xs font-semibold',
            textVariants[variant],
            textClassName
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}
