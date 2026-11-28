import { api } from '@/lib/api';
import type { MetricsResponse } from '@/types/metrics';

export async function getMetrics() {
  const tzOffset = new Date().getTimezoneOffset();
  const response = await api.get<MetricsResponse>('/metrics', {
    params: { tzOffset },
  });
  return response.data;
}