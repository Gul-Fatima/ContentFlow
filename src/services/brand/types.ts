export type GoalId =
  | 'awareness'
  | 'sales'
  | 'leads'
  | 'engagement'
  | 'community'
  | 'leadership';

export interface BrandProfile {
  brandName: string;
  industry: string;
  website?: string;
  purpose: string;
  goals: GoalId[];
}
