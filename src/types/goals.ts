export type GoalType = 'personal' | 'shared';
export type GoalUserId = 'jose' | 'anto' | 'both';
export type GoalModule = 'nutrition' | 'fitness' | 'finance' | 'learning' | 'general';
export type GoalStatus = 'active' | 'completed' | 'paused';

export interface Goal {
  id: string;
  type: GoalType;
  userId: GoalUserId;
  module: GoalModule;
  title: string;
  description: string;
  targetValue: number;
  currentValueJose: number;
  currentValueAnto: number; // same as currentValueJose for personal goals or unused based on context
  unit: string;
  deadline: string; // ISO date string or human readable
  status: GoalStatus;
}
