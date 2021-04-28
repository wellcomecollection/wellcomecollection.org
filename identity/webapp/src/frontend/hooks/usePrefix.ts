export function usePrefix(): string {
  return document.getElementById('root')?.getAttribute('data-context-path') || '';
}
