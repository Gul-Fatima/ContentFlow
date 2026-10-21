import type { LucideIcon } from 'lucide-react-native';
import {
  BarChart3,
  Brain,
  CalendarClock,
  Inbox,
  LayoutGrid,
} from 'lucide-react-native';
import { ROUTES, type AppRoute } from './routes';

export interface NavItem {
  label: string;
  route: AppRoute;
  icon: LucideIcon;
  /** Pending count; omitted when there is nothing to show. */
  badge?: number;
}

/**
 * The single source of truth for primary navigation.
 * Sidebar (>= 768) and BottomTabBar (< 768) both render from this array —
 * never add a second hardcoded list.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', route: ROUTES.dashboard, icon: LayoutGrid },
  { label: 'Brand', route: ROUTES.memory, icon: Brain },
  // TODO: badge counts from API.
  { label: 'Approval', route: ROUTES.approval, icon: Inbox, badge: 5 },
  {
    label: 'Scheduled',
    route: ROUTES.scheduler,
    icon: CalendarClock,
    badge: 10,
  },
  { label: 'Analytics', route: ROUTES.analytics, icon: BarChart3 },
];
