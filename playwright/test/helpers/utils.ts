import { expect } from 'playwright/test';

export const baseUrl = (
  process.env.PLAYWRIGHT_BASE_URL
    ? process.env.PLAYWRIGHT_BASE_URL
    : 'http://localhost:3000'
).replace(/\/$/, '');
export const useStageApis = process.env.USE_STAGE_APIS
  ? process.env.USE_STAGE_APIS && process.env.USE_STAGE_APIS === 'true'
  : false;

// Certain pages, such as search, tend to be slower to load and will benefit from a longer timeout
// Default is currently 5000 https://playwright.dev/docs/test-timeouts
export const slowExpect = expect.configure({ timeout: 10000 });

export const ItemViewerURLRegex = /\/works\/[a-zA-Z0-9]+\/images[?]id=/;

/** Build a URL with properly encoded query params from readable values.
 *
 *  By default, encodes spaces as + (matching URLSearchParams / href attributes).
 *  Pass browserUrl: true to encode spaces as %20 (matching browser URL bar).
 *
 *  e.g. urlWithParams('/search/works', { query: 'art of science' })
 *  → '/search/works?query=art+of+science'
 *
 *  e.g. urlWithParams('/search/works', { query: 'art of science' }, { browserUrl: true })
 *  → '/search/works?query=art%20of%20science'
 */
export function urlWithParams(
  path: string,
  params: Record<string, string>,
  { browserUrl = false }: { browserUrl?: boolean } = {}
): string {
  let query = new URLSearchParams(params).toString();
  if (!query) return path;
  if (browserUrl) query = query.replaceAll('+', '%20');
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}${query}`;
}
