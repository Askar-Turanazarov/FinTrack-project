export function formatMoney(minor: number): string {
  return (minor / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2 });
}
