export function formatNumber(value: number, maxDecimals = 1) {
  return Number(value.toFixed(maxDecimals)).toLocaleString('pt-BR', {
    maximumFractionDigits: maxDecimals,
  });
}