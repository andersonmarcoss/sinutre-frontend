import { useEffect, useState } from 'react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { BmiCard } from '@/components/metrics/BmiCard';
import { WeeklyCaloriesCard } from '@/components/metrics/WeeklyCaloriesCard';
import { getApiError } from '@/lib/api';
import { getMetrics } from '@/services/metricsService';
import type { MetricsResponse } from '@/types/metrics';

export function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setError(null);
        const data = await getMetrics();
        setMetrics(data);
      } catch (err) {
        setError(getApiError(err).message);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
      <SimpleHeader
        title="Métricas"
        subtitle="Acompanhe seu IMC e sua média calórica semanal"
      />

      {error && <div className="alert alert-error text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <BmiCard bmi={metrics?.bmi ?? null} loading={loading} />
        <WeeklyCaloriesCard
          weeklyCalories={metrics?.weeklyCalories ?? null}
          loading={loading}
        />
      </div>
    </div>
  );
}