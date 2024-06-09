export function formatPrice(p: number) {
  const format = new Intl.NumberFormat('he-IL', {
    maximumSignificantDigits: 3,
  }).format(p);
  return `  ${format} ₪  `;
}
