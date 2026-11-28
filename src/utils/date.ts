export function formatDate(
  date: string,
) {
  return new Date(date)
    .toLocaleDateString('pt-BR');
}

export function formatDateTime(
  date: string,
) {
  return new Date(date)
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',

      hour: '2-digit',
      minute: '2-digit',
    });
}

export function isSameLocalDay(
  dateInput: string | Date,
  reference = new Date(),
) {
  const date = new Date(dateInput);
  return (
    date.getDate() === reference.getDate() &&
    date.getMonth() === reference.getMonth() &&
    date.getFullYear() === reference.getFullYear()
  );
}

export function isSameLocalMonth(
  dateInput: string | Date,
  reference = new Date(),
) {
  const date = new Date(dateInput);
  return (
    date.getMonth() === reference.getMonth() &&
    date.getFullYear() === reference.getFullYear()
  );
}

export function getTodayLocalDateInput(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}