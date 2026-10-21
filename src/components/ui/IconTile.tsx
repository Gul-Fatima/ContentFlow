import React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';
import { iconColor } from '../../lib/theme';

export type IconTileTone = 'warning' | 'primary' | 'success' | 'danger';

interface IconTileProps {
  icon: React.ReactNode;
  tone: IconTileTone;
  className?: string;
}

const backgrounds: Record<IconTileTone, string> = {
  warning: 'bg-warning-soft',
  primary: 'bg-primary-100',
  success: 'bg-success-soft',
  danger: 'bg-danger-soft',
};

const iconColors: Record<IconTileTone, string> = {
  warning: iconColor.warning,
  primary: iconColor.primary,
  success: iconColor.success,
  danger: iconColor.danger,
};

/** Fixed 48px rounded tile with a tinted background for a single icon. */
export function IconTile({ icon, tone, className }: IconTileProps) {
  return (
    <View
      className={cn(
        'h-12 w-12 items-center justify-center rounded-pill',
        backgrounds[tone],
        className
      )}
    >
      {icon}
    </View>
  );
}

/** Icon colour to pass to lucide icons rendered inside an IconTile. */
export function iconTileColor(tone: IconTileTone): string {
  return iconColors[tone];
}
