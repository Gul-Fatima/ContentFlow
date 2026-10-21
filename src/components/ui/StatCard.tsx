import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '../../lib/utils';
import { Card } from './Card';
import { IconTile, type IconTileTone } from './IconTile';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: IconTileTone;
  className?: string;
}

/** KPI tile: tinted IconTile + label + big value inside a Card. */
export function StatCard({ label, value, icon, tone, className }: StatCardProps) {
  return (
    <Card className={cn('flex-1', className)}>
      <View className="flex-row items-center gap-4">
        <IconTile icon={icon} tone={tone} />
        <View className="flex-1 gap-0.5">
          <Text className="text-xs text-ink-muted">{label}</Text>
          <Text className="text-2xl font-bold text-ink">{value}</Text>
        </View>
      </View>
    </Card>
  );
}
