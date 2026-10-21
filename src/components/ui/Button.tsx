import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';
import { cn } from '../../lib/utils';
import { iconColor, palette } from '../../lib/theme';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success'
  /** @deprecated legacy alias — use `secondary`. */
  | 'outline';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Expand to the full available width. */
  fullWidth?: boolean;
  /** Show a spinner and ignore presses. */
  loading?: boolean;
  /** @deprecated legacy alias — use `loading`. */
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  /** @deprecated prefer variants; kept for legacy call sites. */
  textClassName?: string;
  children?: React.ReactNode;
}

const containerVariants: Record<Exclude<ButtonVariant, 'outline'>, string> = {
  primary: 'bg-primary-600 active:bg-primary-700',
  secondary: 'bg-white border border-surface-border active:bg-surface-muted',
  ghost: 'bg-transparent active:bg-surface-muted',
  danger: 'bg-danger active:bg-danger',
  success: 'bg-success active:bg-success',
};

const textVariants: Record<Exclude<ButtonVariant, 'outline'>, string> = {
  primary: 'text-white',
  secondary: 'text-ink',
  ghost: 'text-ink-muted',
  danger: 'text-white',
  success: 'text-white',
};

const sizeContainer: Record<ButtonSize, string> = {
  sm: 'h-9 px-3',
  md: 'h-10 px-4',
  lg: 'h-12 px-6',
  icon: 'h-10 w-10 p-0',
};

const sizeText: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  icon: 'text-sm',
};

/** Legacy `outline` renders as `secondary` (same border, white surface). */
function normalizeVariant(
  variant: ButtonVariant
): Exclude<ButtonVariant, 'outline'> {
  return variant === 'outline' ? 'secondary' : variant;
}

export function Button({
  className,
  textClassName,
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  isLoading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const v = normalizeVariant(variant);
  const showSpinner = loading ?? isLoading ?? false;
  const isDisabled = disabled || showSpinner;
  const spinnerColor =
    v === 'primary' || v === 'danger' || v === 'success'
      ? palette.white
      : iconColor.primary;

  // String/number children get the variant text styling; node children
  // (e.g. an icon) are rendered as-is.
  const isPlainText =
    typeof children === 'string' || typeof children === 'number';

  return (
    <Pressable
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: showSpinner }}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-control font-semibold',
        containerVariants[v],
        sizeContainer[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {showSpinner ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <>
          {leftIcon}
          {isPlainText ? (
            <Text
              className={cn(
                'font-semibold',
                textVariants[v],
                sizeText[size],
                textClassName
              )}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}
