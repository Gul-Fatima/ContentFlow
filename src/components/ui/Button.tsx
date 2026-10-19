import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableProps,
} from 'react-native';
import { cn } from '../../lib/utils';
import { iconColor, palette } from '../../lib/theme';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

const containerVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary-600 active:bg-primary-700 shadow-sm',
  secondary: 'bg-white border border-surface-border active:bg-surface-muted shadow-sm',
  ghost: 'bg-transparent active:bg-surface-muted',
  danger: 'bg-danger active:bg-danger-text shadow-sm',
  outline: 'bg-transparent border border-surface-border active:bg-surface-muted',
};

const textVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-white',
  secondary: 'text-ink',
  ghost: 'text-ink-muted active:text-ink',
  danger: 'text-white',
  outline: 'text-ink-muted',
};

const sizeContainer: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3',
  md: 'h-10 px-4',
  lg: 'h-12 px-6',
};

const sizeText: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function Button({
  className,
  textClassName,
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const spinnerColor =
    variant === 'primary' || variant === 'danger'
      ? palette.white
      : iconColor.primary;

  return (
    <Pressable
      // Pressable has no `disabled` styling of its own, so `disabled` only
      // gates the handler — the opacity classes below render the state.
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center rounded-control',
        containerVariants[variant],
        sizeContainer[size],
        isDisabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {isLoading && (
        <View className="mr-2">
          <ActivityIndicator size="small" color={spinnerColor} />
        </View>
      )}
      {!isLoading && leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
      {children != null ? (
        <Text
          className={cn(
            'font-medium',
            textVariants[variant],
            sizeText[size],
            textClassName
          )}
        >
          {children}
        </Text>
      ) : null}
      {!isLoading && rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
    </Pressable>
  );
}
