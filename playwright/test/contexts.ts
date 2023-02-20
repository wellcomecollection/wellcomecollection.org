import { BrowserContext, Page, errors as playwrightErrors } from 'playwright';
import { baseUrl, useStageApis } from './helpers/urls';
import { devices } from '@playwright/test';

export const gotoWithoutCache = async (
  url: string,
  page: Page
): Promise<void> => {
  const requestUrl = `${url}?cachebust=${Date.now()}`;
  /*
   * What's going on here?
   * @jamieparkinson 23/06/2022
   *
   * For reasons I can't get to the bottom of, sometimes the 'load' event
   * for page navigation doesn't fire: seemingly that's only in webkit browsers
   * within the (Ubuntu) docker image. It seems only to happen on some pages,
   * but I can't see what those pages have in common. Even on those, it's
   * not deterministic. Sometimes it looks like not setting the cookies
   * prevents it, but that isn't foolproof either.
   *
   * There are some issues on the Playwright GitHub (see below), but nobody
   * can nail down a reliable repro case and so it's hard for the maintainers
   * to do much about it.
   * https://github.com/microsoft/playwright/issues/12182
   *
   * My workaround here is to catch these timeouts and to try again but waiting
   * for a different event to 'load'. If this stops working, we might want to
   * try using the 'networkidle' event - which will be slower - or we could
   * wait for an earlier / more primitive event like 'commit' and stick a fixed
   * delay afterwards so subsequent assertions don't fail.
   */
  try {
    await page.goto(requestUrl, {
      waitUntil: 'load',
      timeout: 10 * 1000, // 10s
    });
  } catch (e) {
    if (e instanceof playwrightErrors.TimeoutError) {
      await page.goto(requestUrl, {
        waitUntil: 'domcontentloaded',
      });
    } else {
      throw e;
    }
  }
};

const createCookie = (name: string) => {
  return {
    name: name,
    value: 'true',
    path: '/',
    domain: new URL(baseUrl).host,
  };
};

const acceptCookieCookie = createCookie('WC_cookiesAccepted');
const stageApiToggleCookie = createCookie('toggle_stagingApi');

// TODO: context.addCookies should run for the first test of a suite (even on beforeAll/beforeEach)

const requiredCookies = useStageApis
  ? [acceptCookieCookie, stageApiToggleCookie]
  : [acceptCookieCookie];

const multiVolumeItem = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/mg56yqa4/items`, page);
};

const multiVolumeItem2 = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/ykqft4tw/items`, page);
};

const itemWithAltText = async (
  params: { canvasNumber?: number },
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(
    `${baseUrl}/works/pd4rsazb/items${
      params.canvasNumber ? `?canvas=${params.canvasNumber}` : ''
    }`,
    page
  );
};

const itemWithOnlyOpenAccess = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/w8t2vh3w/items`, page);
};
const itemWithOnlyRestrictedAccess = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/a24nhdcv/items`, page);
};
const itemWithRestrictedAndOpenAccess = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/p9gepwjs/items`, page);
};
const itemWithRestrictedAndNonRestrictedAccess = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/jsmqcwvt/items`, page);
};
const itemWithNonRestrictedAndOpenAccess = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/fa7pymra/items`, page);
};

const itemWithSearchAndStructures = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/re9cyhkt/items`, page);
};

const workWithPhysicalLocationOnly = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/ffd3zeq3`, page);
};

const workWithDigitalLocationOnly = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/j9kukb78`, page);
};

const workWithDigitalLocationAndLocationNote = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/a235xn8e`, page);
};

const itemWithReferenceNumber = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/qqra7v28/items`, page);
};

const newWorksSearch = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/search/works`, page);
};

const article = async (
  id: string,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/articles/${id}`, page);
};

const concept = async (
  id: string,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/concepts/${id}`, page);
};

const articleWithMockSiblings = async (
  id: string,
  response: Record<string, any>,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.route('**/api/**', route =>
    route.fulfill({
      status: 200,
      body: JSON.stringify(response),
    })
  );
  await gotoWithoutCache(`${baseUrl}/articles/${id}`, page);
};

export const event = async (
  id: string,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/events/${id}`, page);
};

const isMobile = (page: Page): boolean =>
  (page.viewportSize()?.width ?? 0) <= devices['iPhone 11'].viewport.width;

export {
  multiVolumeItem,
  multiVolumeItem2,
  itemWithAltText,
  newWorksSearch,
  itemWithSearchAndStructures,
  itemWithReferenceNumber,
  workWithPhysicalLocationOnly,
  workWithDigitalLocationOnly,
  workWithDigitalLocationAndLocationNote,
  itemWithOnlyOpenAccess,
  itemWithOnlyRestrictedAccess,
  itemWithRestrictedAndOpenAccess,
  itemWithRestrictedAndNonRestrictedAccess,
  itemWithNonRestrictedAndOpenAccess,
  article,
  articleWithMockSiblings,
  concept,
  isMobile,
};
