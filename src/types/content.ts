export type Platform = 'twitter' | 'linkedin' | 'instagram' | 'email';

export interface Approval {
  id: string;
  platform: Platform;
  scheduledFor: string;
  scheduledLabel: string;
  title: string;
  body: string;
  imageUrl?: string;
  aiReasoning?: string;
  tone?: number;
  status: 'pending' | 'approved' | 'rejected';
  author?: string;
}

export interface ScheduledPost {
  id: string;
  platform: Platform;
  title: string;
  at: string;
  status: 'scheduled' | 'draft';
  content: string;
  time: string;
  day: number;
  hour: number;
  goalTag?: string;
}

export interface TopContent {
  id: string;
  title: string;
  platform: Platform;
  views: number;
}

export interface BrandRule {
  id: string;
  title: string;
}

export interface Persona {
  name: string;
  role: string;
  pain: string;
  goals: string;
}
