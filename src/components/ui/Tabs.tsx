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
        'flex-row items-center rounded-xl bg-slate-100 p-1',
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
              'flex-1 flex-row items-center justify-center rounded-lg px-4 py-2',
              isActive ? 'bg-white shadow-sm' : 'active:bg-slate-200'
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                isActive ? 'text-brand-700' : 'text-slate-600'
              )}
            >
              {tab.label}
            </Text>
            {tab.count !== undefined && (
              <View
                className={cn(
                  'ml-2 min-w-5 items-center justify-center rounded-full px-1 py-0.5',
                  isActive ? 'bg-brand-100' : 'bg-slate-200'
                )}
              >
                <Text
                  className={cn(
                    'text-[10px] font-medium',
                    isActive ? 'text-brand-700' : 'text-slate-600'
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
