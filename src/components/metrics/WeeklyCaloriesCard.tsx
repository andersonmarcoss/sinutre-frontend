import { Link } from 'react-router-dom';
import { ChartBar } from '@phosphor-icons/react';
import type {
  GoalRelationStatus,
  WeeklyCaloriesMetrics,
} from '@/types/metrics';
import { formatNumber } from '@/utils/number';

interface WeeklyCaloriesCardProps {
  weeklyCalories: WeeklyCaloriesMetrics | null;
  loading?: boolean;
}

const RELATION_BADGE_CLASS: Record<GoalRelationStatus, string> = {
  below: 'badge-info',
  on_target: 'badge-success',
  above: 'badge-error',
};

function formatDayLabel(isoDate: string) {
  const [, month, day] = isoDate.split('-');
  return `${day}/${month}`;
}

export function WeeklyCaloriesCard({
  weeklyCalories,
  loading = false,
}: WeeklyCaloriesCardProps) {
  const days = weeklyCalories?.days ?? [];
  const goal = weeklyCalories?.goal ?? null;
  const maxChartValue = Math.max(
    goal ?? 0,
    ...days.map((d) => d.calories),
    1,
  );
  const goalLinePercent =
    goal !== null ? Math.min(100, (goal / maxChartValue) * 100) : null;

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-full p-2.5">
            <ChartBar size={24} />
          </div>
          <div>
            <h2 className="card-title">Média Calórica (Últimos 7 dias)</h2>
            <p className="text-sm text-base-content/60">
              Média considerando os dias com refeições registradas
            </p>
          </div>
        </div>

        {loading || !weeklyCalories ? (
          <div className="rounded-box bg-base-200 p-6 text-sm text-base-content/60">
            Calculando média semanal...
          </div>
        ) : weeklyCalories.averageCalories === null ? (
          <div className="rounded-box bg-base-200 p-5 flex flex-col items-start gap-3">
            <p className="text-sm text-base-content/70">
              Nenhuma refeição registrada nos últimos 7 dias.
            </p>
            <Link to="/" className="btn btn-primary btn-sm">
              Registrar refeição
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Média e relação com a meta */}
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="text-4xl font-extrabold tracking-tight">
                  {formatNumber(weeklyCalories.averageCalories, 0)}
                </span>
                <span className="text-sm text-base-content/60 ml-2">
                  kcal/dia
                </span>
              </div>

              {weeklyCalories.goalRelation && (
                <span
                  className={`badge badge-lg font-semibold ${
                    RELATION_BADGE_CLASS[weeklyCalories.goalRelation.status]
                  }`}
                >
                  {weeklyCalories.goalRelation.label}
                </span>
              )}
            </div>

            {weeklyCalories.goalRelation ? (
              <p className="text-sm text-base-content/80">
                <strong>
                  {formatNumber(weeklyCalories.goalRelation.percent, 2)}% da meta
                </strong>{' '}
                (
                {weeklyCalories.goalRelation.difference > 0 ? '+' : ''}
                {formatNumber(weeklyCalories.goalRelation.difference, 0)} kcal em
                relação à meta de {formatNumber(goal!, 0)} kcal)
              </p>
            ) : (
              <div className="rounded-box bg-base-200 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-base-content/70">
                  Cadastre sua meta calórica para comparar seu consumo semanal.
                </span>
                <Link to="/profile" className="link link-primary font-medium">
                  Cadastrar meta
                </Link>
              </div>
            )}

            {/* Gráfico de barras dos últimos 7 dias */}
            <div className="flex flex-col gap-2">
              <div className="relative h-36 flex items-end gap-2 pt-2 border-b border-base-300">
                {goalLinePercent !== null && (
                  <div
                    className="absolute inset-x-0 border-t-2 border-dashed border-base-content/40 pointer-events-none z-10"
                    style={{ bottom: `${goalLinePercent}%` }}
                    title={`Meta diária: ${formatNumber(goal!, 0)} kcal`}
                  />
                )}

                {days.map((day) => {
                  const heightPercent =
                    day.calories > 0
                      ? Math.max(4, (day.calories / maxChartValue) * 100)
                      : 0;
                  const isOver =
                    goal !== null && Math.round(day.calories) > goal;
                  const barColor =
                    day.calories === 0
                      ? 'bg-base-300'
                      : isOver
                        ? 'bg-error'
                        : 'bg-primary';

                  return (
                    <div
                      key={day.date}
                      className="flex-1 h-full flex items-end justify-center group"
                      title={`${formatDayLabel(day.date)}: ${formatNumber(
                        day.calories,
                        0,
                      )} kcal`}
                    >
                      <div
                        className={`w-full max-w-8 rounded-t-md transition-all ${barColor}`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 text-[11px] text-base-content/60 text-center">
                {days.map((day) => (
                  <span key={day.date} className="flex-1 truncate">
                    {formatDayLabel(day.date)}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-base-content/60 border-t border-base-200 pt-3">
              <span>
                Baseado em{' '}
                <strong>
                  {weeklyCalories.daysWithMeals}{' '}
                  {weeklyCalories.daysWithMeals === 1 ? 'dia' : 'dias'}
                </strong>{' '}
                com registro
              </span>
              <span>
                Total: <strong>{formatNumber(weeklyCalories.totalCalories, 0)} kcal</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}