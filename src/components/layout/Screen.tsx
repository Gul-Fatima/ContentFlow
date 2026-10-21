import React from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Header } from './Header';

interface ScreenProps {
  /** Kept for call-site compatibility; the shell header shows the greeting. */
  title: string;
  children: React.ReactNode;
  scroll?: boolean;
  contentClassName?: string;
}

const MOBILE_BREAKPOINT = 768;

/**
 * Standard app-shell screen: header plus a scrollable body.
 * Every route under `app/(app)` renders through this so headers stay
 * consistent.
 *
 * The bottom tab bar is a flex sibling of this screen, so the shell layout
 * already reserves its height — nothing here may add bottom padding for it.
 * On mobile the ScrollView fills the remaining space down to the bar's top
 * edge and only its content gets 24px of breathing room above the bar. The
 * bar's safe-area inset lives in `BottomTabBar`; the top inset in `Header`.
 */
export function Screen({
  children,
  scroll = true,
  contentClassName,
}: ScreenProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  return (
    <View className="flex-1 bg-surface-page">
      <Header />
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={contentClassName ?? 'p-4 pb-16'}
          contentContainerStyle={isMobile ? { paddingBottom: 24 } : undefined}
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
