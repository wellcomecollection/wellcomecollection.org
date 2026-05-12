import { expect } from 'playwright/test';

export const baseUrl = process.env.PLAYWRIGHT_BASE_URL
  ? process.env.PLAYWRIGHT_BASE_URL
  : 'http://localhost:3000';
export const useStageApis = process.env.USE_STAGE_APIS
  ? process.env.USE_STAGE_APIS && process.env.USE_STAGE_APIS === 'true'
  : false;

// Certain pages, such as search, tend to be slower to load and will benefit from a longer timeout
// Default is currently 5000 https://playwright.dev/docs/test-timeouts
export const slowExpect = expect.configure({ timeout: 10000 });

export const ItemViewerURLRegex = /\/works\/[a-zA-Z0-9]+\/images[?]id=/;

/** Build a URL with properly encoded query params from readable values.
 *
 *  e.g. urlWithParams('/search/works', { 'subjects.label': '"British Army"' })
 *  → '/search/works?subjects.label=%22British+Army%22'
 */
export function urlWithParams(
  path: string,
  params: Record<string, string>
): string {
  const query = new URLSearchParams(params).toString();
  if (!query) return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}${query}`;
}
