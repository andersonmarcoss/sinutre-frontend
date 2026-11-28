import { Link } from 'react-router-dom';
import { Scales } from '@phosphor-icons/react';
import type { BmiMetrics, BmiStatus } from '@/types/metrics';
import { formatNumber } from '@/utils/number';

interface BmiCardProps {
  bmi: BmiMetrics | null;
  loading?: boolean;
}

const STATUS_BADGE_CLASS: Record<BmiStatus, string> = {
  info: 'badge-info',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
};

const RULER_MIN = 15;
const RULER_SPAN = 25; // 15 até 40

export function BmiCard({ bmi, loading = false }: BmiCardProps) {
  const markerPercent = bmi
    ? Math.min(100, Math.max(0, ((bmi.value - RULER_MIN) / RULER_SPAN) * 100))
    : 0;

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body justify-between gap-4">
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

        {loading ? (
          <div className="rounded-box bg-base-200 p-6 text-sm text-base-content/60">
            Calculando IMC...
          </div>
        ) : !bmi ? (
          <div className="rounded-box bg-base-200 p-5 flex flex-col items-start gap-3">
            <p className="text-sm text-base-content/70">
              Cadastre sua altura e peso no perfil para calcular seu IMC.
            </p>
            <Link to="/profile" className="btn btn-primary btn-sm">
              Cadastrar perfil
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="text-4xl font-extrabold tracking-tight">
                  {formatNumber(bmi.value, 1)}
                </span>
                <span className="text-sm text-base-content/60 ml-2">kg/m²</span>
              </div>

              <span className={`badge badge-lg font-semibold ${STATUS_BADGE_CLASS[bmi.status]}`}>
                {bmi.category}
              </span>
            </div>

            {/* Régua proporcional das faixas (15 a 40) */}
            <div className="flex flex-col gap-1.5">
              <div className="relative pt-2">
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-base-200">
                  <div className="bg-info h-full" style={{ width: '14%' }} title="Abaixo (< 18,5)" />
                  <div className="bg-success h-full" style={{ width: '26%' }} title="Normal (18,5 – 24,9)" />
                  <div className="bg-warning h-full" style={{ width: '20%' }} title="Sobrepeso (25 – 29,9)" />
                  <div className="bg-error h-full" style={{ width: '40%' }} title="Obesidade (≥ 30)" />
                </div>

                <div
                  className="absolute top-0.5 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${markerPercent}%` }}
                  aria-label={`Marcador de IMC em ${formatNumber(bmi.value, 1)}`}
                >
                  <div className="w-3.5 h-6 rounded-full bg-base-content border-2 border-base-100 shadow" />
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-base-content/50">
                <span>15</span>
                <span>18,5</span>
                <span>25</span>
                <span>30</span>
                <span>40+</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-base-content/60 border-t border-base-200 pt-3">
              <span>
                Peso: <strong>{formatNumber(bmi.weight, 1)} kg</strong> · Altura:{' '}
                <strong>{formatNumber(bmi.height, 1)} cm</strong>
              </span>
              <Link to="/profile" className="link link-primary font-medium">
                Atualizar
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}