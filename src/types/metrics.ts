export type BmiStatus = 'info' | 'success' | 'warning' | 'error';

export interface BmiMetrics {
  value: number;
  category: string;
  status: BmiStatus;
  height: number;
  weight: number;
}

export interface MetricsResponse {
  bmi: BmiMetrics | null;
}