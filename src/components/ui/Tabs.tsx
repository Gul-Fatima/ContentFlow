import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface LegacyTab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items?: TabItem[];
  value?: string;
  onChange: (key: string) => void;
  /** @deprecated legacy alias for `items` (uses `id` instead of `key`). */
  tabs?: LegacyTab[];
  /** @deprecated legacy alias for `value`. */
  activeTab?: string;
  className?: string;
}

export function Tabs({
  items,
  value,
  onChange,
  tabs,
  activeTab,
  className,
}: TabsProps) {
  const normalized: TabItem[] =
    items ?? tabs?.map((t) => ({ key: t.id, label: t.label, count: t.count })) ?? [];
  const activeKey = value ?? activeTab;

  return (
    <View
      className={cn(
        'rounded-control border border-surface-border bg-white p-1',
        className
      )}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-1"
      >
        {normalized.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => onChange(item.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              className={cn(
                'flex-row items-center justify-center gap-1.5 rounded-control px-4 py-1.5',
                isActive ? 'bg-primary-50' : 'active:bg-surface-muted'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-primary-700' : 'text-ink-subtle'
                )}
              >
                {item.label}
              </Text>
              {item.count !== undefined && (
                <Badge variant="count">{item.count}</Badge>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
