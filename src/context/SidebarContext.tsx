import React, { createContext, useContext, useState } from 'react';
import { useWindowDimensions } from 'react-native';

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  // `null` means "use the mode default" (collapsed below 1024, expanded at
  // 1024+). Once the user toggles, that explicit choice is preserved.
  const [userCollapsed, setUserCollapsed] = useState<boolean | null>(null);
  const collapsed = userCollapsed ?? !isDesktop;

  const toggle = () => setUserCollapsed(!collapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const value = useContext(SidebarContext);
  if (!value) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return value;
}
