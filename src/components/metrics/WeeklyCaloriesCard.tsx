import { ChartBar } from '@phosphor-icons/react';

export function WeeklyCaloriesCard() {
  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-full p-2.5">
            <ChartBar size={24} />
          </div>
          <div>
            <h2 className="card-title">Média Calórica (Últimos 7 dias)</h2>
            <p className="text-sm text-base-content/60">
              Comparativo do consumo recente com sua meta diária
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-box bg-base-200 p-4 text-sm text-base-content/70">
          A média calórica semanal e a comparação com a meta serão exibidas
          aqui em breve.
        </div>
      </div>
    </section>
  );
}