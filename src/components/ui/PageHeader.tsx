import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Page title + optional description + optional actions.
 * Actions sit to the right on width >= 768 and stack below the text
 * (full-width, wrapping row) on mobile.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View
      className={cn(
        'gap-4',
        isDesktop && 'flex-row items-center justify-between',
        className
      )}
    >
      <View className="flex-1 gap-1">
        <Text className="text-2xl font-bold text-ink">{title}</Text>
        {description ? (
          <Text className="text-sm text-ink-subtle">{description}</Text>
        ) : null}
      </View>
      {actions ? (
        <View
          className={cn(
            'flex-row flex-wrap items-center gap-3',
            isDesktop ? 'shrink-0' : 'w-full'
          )}
        >
          {actions}
        </View>
      ) : null}
    </View>
  );
}
