import React from 'react';
import { Text, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

export type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'outline'
  | 'count'
  /** @deprecated legacy alias — use `primary`. */
  | 'default'
  /** @deprecated legacy alias — use `neutral`. */
  | 'secondary'
  /** @deprecated legacy alias — use `danger`. */
  | 'error';

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

const variants: Record<
  Exclude<BadgeVariant, 'default' | 'secondary' | 'error'>,
  string
> = {
  neutral: 'border-transparent bg-surface-muted',
  primary: 'border-transparent bg-primary-50',
  success: 'border-transparent bg-success-soft',
  danger: 'border-transparent bg-danger-soft',
  warning: 'border-transparent bg-warning-soft',
  outline: 'border border-surface-border bg-transparent',
  count:
    'border-transparent bg-primary-600 min-w-5 min-h-5 items-center justify-center px-1 py-0',
};

const textVariants: Record<
  Exclude<BadgeVariant, 'default' | 'secondary' | 'error'>,
  string
> = {
  neutral: 'text-ink',
  primary: 'text-primary-700',
  success: 'text-success-text',
  danger: 'text-danger-text',
  warning: 'text-warning-text',
  outline: 'text-ink-muted',
  count: 'text-caption font-semibold text-white',
};

/** Map legacy variant names onto the new set. */
function normalizeVariant(
  variant: BadgeVariant
): Exclude<BadgeVariant, 'default' | 'secondary' | 'error'> {
  if (variant === 'default') return 'primary';
  if (variant === 'secondary') return 'neutral';
  if (variant === 'error') return 'danger';
  return variant;
}

export function Badge({
  className,
  textClassName,
  variant = 'neutral',
  children,
  ...props
}: BadgeProps) {
  const v = normalizeVariant(variant);
  // A `View` can't be nested inside a `Text` on native, so plain strings get
  // the variant text styling and anything else is rendered as-is (callers then
  // own the text colour, e.g. a row with an icon).
  const isPlainText =
    typeof children === 'string' || typeof children === 'number';

  return (
    <View
      className={cn(
        'flex-row items-center self-start rounded-pill border px-2 py-0.5',
        variants[v],
        className
      )}
      {...props}
    >
      {isPlainText ? (
        <Text
          className={cn(
            'text-caption font-medium',
            textVariants[v],
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
