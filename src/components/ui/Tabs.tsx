import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <View
      className={cn(
        'flex-row items-center rounded-card bg-surface-muted p-1',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            className={cn(
              'flex-1 flex-row items-center justify-center rounded-control px-4 py-2',
              isActive ? 'bg-white shadow-sm' : 'active:bg-surface-border'
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                isActive ? 'text-primary-700' : 'text-ink-muted'
              )}
            >
              {tab.label}
            </Text>
            {tab.count !== undefined && (
              <View
                className={cn(
                  'ml-2 min-w-5 items-center justify-center rounded-pill px-1 py-0.5',
                  isActive ? 'bg-primary-100' : 'bg-surface-border'
                )}
              >
                <Text
                  className={cn(
                    'text-caption font-medium',
                    isActive ? 'text-primary-700' : 'text-ink-muted'
                  )}
                >
                  {tab.count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
