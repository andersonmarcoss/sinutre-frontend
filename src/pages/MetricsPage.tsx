import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { BmiCard } from '@/components/metrics/BmiCard';
import { WeeklyCaloriesCard } from '@/components/metrics/WeeklyCaloriesCard';

export function MetricsPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
      <SimpleHeader
        title="Métricas"
        subtitle="Acompanhe seu IMC e sua média calórica semanal"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <BmiCard />
        <WeeklyCaloriesCard />
      </div>
    </div>
  );
}