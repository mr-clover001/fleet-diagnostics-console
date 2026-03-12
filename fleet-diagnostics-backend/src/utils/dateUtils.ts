export function isValidISODate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function toISOString(dateStr: string): string {
  return new Date(dateStr).toISOString();
}
