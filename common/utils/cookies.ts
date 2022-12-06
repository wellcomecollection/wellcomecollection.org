export function getActiveToggles(
  cookies: Partial<{ [key: string]: string }>
): string[] {
  return Object.entries(cookies)
    .filter(([k, v]) => k.startsWith('toggle_') && v === 'true')
    .map(kv => kv[0].replace('toggle_', ''))
    .sort();
}
