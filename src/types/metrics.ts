export type BmiStatus = 'info' | 'success' | 'warning' | 'error';
export type GoalRelationStatus = 'below' | 'on_target' | 'above';

export interface BmiMetrics {
  value: number;
  category: string;
  status: BmiStatus;
  height: number;
  weight: number;
}

export interface DailyCaloriesItem {
  date: string;
  calories: number;
}

export interface GoalRelation {
  percent: number;
  difference: number;
  status: GoalRelationStatus;
  label: string;
}

export interface WeeklyCaloriesMetrics {
  days: DailyCaloriesItem[];
  totalCalories: number;
  daysWithMeals: number;
  averageCalories: number | null;
  goal: number | null;
  goalRelation: GoalRelation | null;
}

export interface MetricsResponse {
  bmi: BmiMetrics | null;
  weeklyCalories: WeeklyCaloriesMetrics;
}