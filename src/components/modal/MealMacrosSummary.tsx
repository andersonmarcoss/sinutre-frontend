import type { MacroSummary } from '@/types/meal';
import { formatNumber } from '@/utils/number';

interface MealMacrosSummaryProps {
  macros: Pick<MacroSummary, 'carbs' | 'proteins' | 'fats' | 'calories'>;
}

export function MealMacrosSummary({ macros }: MealMacrosSummaryProps) {
  return (
    <section className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8 bg-base-100">
      <div className="stat text-center">
        <div className="stat-title">Carboidratos</div>
        <div className="stat-value text-3xl">{formatNumber(macros.carbs, 1)} g</div>
      </div>
      <div className="stat text-center">
        <div className="stat-title">Proteínas</div>
        <div className="stat-value text-3xl">{formatNumber(macros.proteins, 1)} g</div>
      </div>
      <div className="stat text-center">
        <div className="stat-title">Gordura</div>
        <div className="stat-value text-3xl">{formatNumber(macros.fats, 1)} g</div>
      </div>
      <div className="stat text-center bg-primary text-primary-content">
        <div className="stat-title text-primary-content/70">Calorias</div>
        <div className="stat-value text-3xl">{formatNumber(macros.calories, 0)} kcal</div>
        <div className="stat-desc text-primary-content/70">Nesta refeição</div>
      </div>
    </section>
  );
}