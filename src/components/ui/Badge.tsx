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
  default: 'border-transparent bg-primary-600',
  secondary: 'border-transparent bg-surface-muted',
  success: 'border-transparent bg-success-soft',
  warning: 'border-transparent bg-warning-soft',
  error: 'border-transparent bg-danger-soft',
  outline: 'border-surface-border bg-transparent',
};

const textVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'text-white',
  secondary: 'text-ink',
  success: 'text-success-text',
  warning: 'text-warning-text',
  error: 'text-danger-text',
  outline: 'text-ink',
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
        'flex-row items-center self-start rounded-pill border px-2.5 py-0.5',
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
