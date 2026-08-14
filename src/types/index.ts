export type Status =
'pending' |
'in-progress' |
'completed' |
'approved' |
'rejected' |
'revision-requested';

export interface Goal {
  id: string;
  title: string;
  progress: number;
  taskCount: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  reasoning: string;
  status: 'pending' | 'in-progress' | 'completed';
  goalId: string;
}

export interface ContentItem {
  id: string;
  platform: 'twitter' | 'instagram' | 'linkedin' | 'email';
  content: string;
  image?: string;
  reasoning: string;
  scheduledTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision-requested';
  author: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  painPoints: string[];
}

export interface BrandVoice {
  description: string;
  formalCasual: number; // 0-100
  seriousPlayful: number; // 0-100
}

export interface Metric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}