import { Scales } from '@phosphor-icons/react';

export function BmiCard() {
  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-full p-2.5">
            <Scales size={24} />
          </div>
          <div>
            <h2 className="card-title">Índice de Massa Corporal (IMC)</h2>
            <p className="text-sm text-base-content/60">
              Cálculo com base na altura e peso cadastrados
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-box bg-base-200 p-4 text-sm text-base-content/70">
          Os dados de IMC e a faixa de classificação serão exibidos aqui após
          a integração com o perfil.
        </div>
      </div>
    </section>
  );
}