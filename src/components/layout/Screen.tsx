import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from './Header';

interface ScreenProps {
  title: string;
  children: React.ReactNode;
  scroll?: boolean;
  contentClassName?: string;
}

/**
 * Standard app-shell screen: safe-area aware header plus a scrollable body.
 * Every route under `app/(app)` renders through this so headers stay consistent.
 */
export function Screen({
  title,
  children,
  scroll = true,
  contentClassName,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-cream" style={{ paddingTop: insets.top }}>
      <Header title={title} />
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={contentClassName ?? 'p-4 pb-16'}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View className={contentClassName ?? 'flex-1'}>{children}</View>
      )}
    </View>
  );
}
