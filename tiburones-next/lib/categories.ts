export const CATEGORY_COLORS: Record<string, string> = {
  'Taxonomía':     '#1e3040',
  'Conservación':  '#374d4a',
  'Comportamiento':'#2a4558',
  'Distribución':  '#3a6272',
  'Identificación':'#4c6664',
  'Ecología':      '#516c62',
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#131e27'
}
