import React from 'react';
import { ScrollView, View } from 'react-native';
import { Header } from './Header';

interface ScreenProps {
  /** Kept for call sites; the app shell now titles every page "Hi {name}!". */
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
  children,
  scroll = true,
  contentClassName,
}: ScreenProps) {
  return (
    <View className="flex-1 bg-surface-page">
      <Header />
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
