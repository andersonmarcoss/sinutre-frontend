import { Warning } from '@phosphor-icons/react';
import type { MacroSummary } from '@/types/meal';
import { formatNumber } from '@/utils/number';
import { MacroStat } from './MacroStat';

interface MacroStatsBarProps {
  summary: MacroSummary;
}

export function MacroStatsBar({ summary }: MacroStatsBarProps) {
  const hasGoal = summary.caloriesGoal !== null;
  const roundedCalories = Math.round(summary.calories);
  const isOverGoal =
    summary.caloriesGoal !== null && roundedCalories > summary.caloriesGoal;
  const excessCalories = isOverGoal
    ? roundedCalories - summary.caloriesGoal!
    : 0;

  return (
    <div className="flex flex-col gap-3 w-full">
      {isOverGoal && (
        <div role="alert" className="alert alert-error shadow-sm">
          <Warning size={22} weight="fill" className="shrink-0" />
          <span className="font-medium">
            Você ultrapassou sua meta diária em{' '}
            <strong>{formatNumber(excessCalories, 0)} kcal</strong>.
          </span>
        </div>
      )}

      <section className="stats stats-vertical lg:stats-horizontal shadow-sm w-full bg-base-100">
        <MacroStat label="Carboidratos" value={summary.carbs} unit="g" />
        <MacroStat label="Proteínas" value={summary.proteins} unit="g" />
        <MacroStat label="Gordura" value={summary.fats} unit="g" />
        <MacroStat
          label={hasGoal ? 'Calorias / Meta Diária' : 'Calorias Hoje'}
          value={summary.calories}
          unit="kcal"
          variant={isOverGoal ? 'danger' : 'highlight'}
          goal={summary.caloriesGoal}
          hint={
            !hasGoal
              ? 'Meta não cadastrada'
              : isOverGoal
                ? `+${formatNumber(excessCalories, 0)} kcal acima da meta`
                : 'kcal'
          }
        />
      </section>
    </div>
  );
}