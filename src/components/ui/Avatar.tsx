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
          'relative items-center justify-center overflow-hidden rounded-full bg-slate-100',
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
          <View className="h-full w-full items-center justify-center bg-brand-100">
            <Text className={cn('font-medium text-brand-700', textSizes[size])}>
              {fallback}
            </Text>
          </View>
        )}
      </View>
      {showStatus && (
        <View className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
      )}
    </View>
  );
}
