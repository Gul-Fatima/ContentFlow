import {
  BarChart3,
  Brain,
  CalendarClock,
  Sparkles,
  type LucideIcon,
} from 'lucide-react-native';

export interface AuthFeature {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
}

export const AUTH_FEATURES: AuthFeature[] = [
  {
    Icon: Sparkles,
    title: 'AI-Powered Content',
    subtitle: 'Generate on-brand posts in seconds',
  },
  {
    Icon: CalendarClock,
    title: 'Smart Scheduling',
    subtitle: 'Post at the perfect time, every time',
  },
  {
    Icon: Brain,
    title: 'Brand Memory',
    subtitle: 'AI that learns your voice and tone',
  },
  {
    Icon: BarChart3,
    title: 'Deep Analytics',
    subtitle: 'Track what works and optimize',
  },
];

// PLACEHOLDER: replace with a real testimonial or set to false before launch
export const SHOW_SOCIAL_PROOF = true;
