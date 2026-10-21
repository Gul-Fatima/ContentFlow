import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../brand/Logo';
import { AuthBrandPanel } from './AuthBrandPanel';

export function AuthShell({
  children,
  topRight,
}: {
  children: ReactNode;
  topRight?: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  if (width >= 1024) {
    const panelWidth = Math.min(560, Math.max(420, width * 0.37));

    return (
      <View className="flex-1 flex-row bg-white">
        <View style={{ width: panelWidth }}>
          <AuthBrandPanel />
        </View>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 32,
            }}
          >
            <View className="w-full max-w-[400px]">{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View
        className="h-16 flex-row items-center justify-between px-5"
        style={{ paddingTop: insets.top }}
      >
        <Logo variant="onLight" size="sm" />
        {topRight}
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 40 + insets.bottom,
          }}
        >
          <View className="w-full max-w-[400px]">{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
