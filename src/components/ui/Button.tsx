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
  primary: 'bg-brand-600 active:bg-brand-700 shadow-sm',
  secondary: 'bg-white border border-slate-200 active:bg-cream shadow-sm',
  ghost: 'bg-transparent active:bg-slate-100',
  danger: 'bg-rose-600 active:bg-rose-700 shadow-sm',
  outline: 'bg-transparent border border-slate-200 active:bg-cream',
};

const textVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-white',
  secondary: 'text-brown',
  ghost: 'text-slate-600 active:text-brown',
  danger: 'text-white',
  outline: 'text-slate-700',
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
        'flex-row items-center justify-center rounded-md',
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
