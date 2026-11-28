import { api } from '@/lib/api';
import type { MetricsResponse } from '@/types/metrics';

export async function getMetrics() {
  const response = await api.get<MetricsResponse>('/metrics');
  return response.data;
}