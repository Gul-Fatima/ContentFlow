import React from 'react';
import { Text, View, type TextProps, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn(
        'rounded-card border border-surface-border bg-white shadow-sm',
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
  return <View className={cn('flex-col p-6', className)} {...props} />;
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
  return <View className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return <View className={cn('flex-row items-center p-6 pt-0', className)} {...props} />;
}
