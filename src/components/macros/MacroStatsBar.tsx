import type { MacroSummary } from '@/types/meal';
import { MacroStat } from './MacroStat';

interface MacroStatsBarProps {
  summary: MacroSummary;
}

export function MacroStatsBar({ summary }: MacroStatsBarProps) {
  const hasGoal = summary.caloriesGoal !== null;
  const isOverGoal =
    summary.caloriesGoal !== null &&
    summary.calories > summary.caloriesGoal;

  return (
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
        hint={hasGoal ? 'kcal' : 'Meta não cadastrada'}
      />
    </section>
  );
}