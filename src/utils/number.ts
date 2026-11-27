export function formatNumber(value: number, maxDecimals = 1) {
  return Number(value.toFixed(maxDecimals)).toLocaleString('pt-BR', {
    maximumFractionDigits: maxDecimals,
  });
}

export function parseNumericInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}