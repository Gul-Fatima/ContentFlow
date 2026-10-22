import type { BrandRule, Persona } from '../../types/content';

export const MOCK_BRAND_RULES: BrandRule[] = [
  { id: '1', title: 'Always use Oxford commas' },
  { id: '2', title: 'Never mention competitors by name' },
  { id: '3', title: 'Emojis should be used sparingly (max 2 per post)' },
  { id: '4', title: 'Always include a Call to Action (CTA)' },
  { id: '5', title: 'Dates must be in US format (MM/DD/YYYY)' },
];

export const MOCK_PERSONAS: Persona[] = [
  {
    name: 'The Busy Founder',
    role: 'Startup CEO',
    pain: 'No time for consistency',
    goals: 'Efficiency, Scale, Automation',
  },
  {
    name: 'Agency Alice',
    role: 'Social Media Manager',
    pain: 'Overwhelmed by client approvals',
    goals: 'Efficiency, Scale, Automation',
  },
  {
    name: 'Marketing Mike',
    role: 'CMO',
    pain: 'Need to prove ROI to board',
    goals: 'Efficiency, Scale, Automation',
  },
];
