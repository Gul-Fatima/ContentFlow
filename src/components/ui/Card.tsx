import React from 'react';
import { Text, View, type TextProps, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const paddingClass: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({
  className,
  padding,
  ...props
}: ViewProps & { className?: string; padding?: CardPadding }) {
  return (
    <View
      className={cn(
        'rounded-card border border-surface-border bg-surface-card shadow-sm',
        paddingClass[padding ?? 'md'],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return <View className={cn('flex-col pb-5', className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: TextProps & { className?: string }) {
  return (
    <Text
      className={cn(
        'text-base font-semibold leading-tight text-ink',
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: TextProps & { className?: string }) {
  return (
    <Text className={cn('text-sm text-ink-subtle', className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return <View className={cn('', className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return (
    <View className={cn('flex-row items-center gap-3', className)} {...props} />
  );
}
