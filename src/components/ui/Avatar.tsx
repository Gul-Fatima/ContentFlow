import React from 'react';
import { Image, Text, View } from 'react-native';
import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Hide the online dot (e.g. in dense lists). */
  showStatus?: boolean;
}

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function Avatar({
  src,
  fallback,
  size = 'md',
  className,
  showStatus = true,
}: AvatarProps) {
  return (
    <View className={cn('relative', className)}>
      <View
        className={cn(
          'relative items-center justify-center overflow-hidden rounded-pill bg-surface-muted',
          sizes[size]
        )}
      >
        {src ? (
          <Image
            className="h-full w-full"
            source={{ uri: src }}
            resizeMode="cover"
            accessibilityLabel={fallback}
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-primary-100">
            <Text className={cn('font-medium text-primary-700', textSizes[size])}>
              {fallback}
            </Text>
          </View>
        )}
      </View>
      {showStatus && (
        <View className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-pill border-2 border-white bg-success" />
      )}
    </View>
  );
}
