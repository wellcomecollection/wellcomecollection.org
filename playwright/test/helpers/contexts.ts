import { devices } from '@playwright/test';
import * as prismic from '@prismicio/client';
import { BrowserContext, Page, errors as playwrightErrors } from 'playwright';

import { ArticlesDocument as RawArticlesDocument } from '@weco/common/prismicio-types';

import { baseUrl, useStageApis } from './utils';

export const gotoWithoutCache = async (
  url: string,
  page: Page
): Promise<void> => {
  // Check if the URL already has query parameters before adding a cachebust.
  // We could make this more robust (e.g. checking for fragments), but this is
  // good enough for now.
  const requestUrl =
    url.indexOf('?') === -1
      ? `${url}?cachebust=${Date.now()}`
      : `${url}&cachebust=${Date.now()}`;

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

export type CookieProps = {
  name: string;
  value: string;
  path: string;
  domain: string;
};

const createCookie = ({
  name,
  value,
}: {
  name: string;
  value: string;
}): CookieProps => {
  return {
    name,
    value,
    path: '/',
    domain: new URL(baseUrl).host,
  };
};

const acceptCookieCookie = createCookie({ name: 'CookieControl', value: '{}' });
const stageApiToggleCookie = createCookie({
  name: 'toggle_stagingApi',
  value: 'true',
});
const exInEvToggleCookie = createCookie({
  name: 'toggle_exhibitionsInEvents',
  value: 'true',
});

export const requiredCookies = useStageApis
  ? [acceptCookieCookie, stageApiToggleCookie, exInEvToggleCookie]
  : [acceptCookieCookie, exInEvToggleCookie];

const multiVolumeItem = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/mg56yqa4/items`, page);
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

const itemWithSearchAndStructuresAndQuery = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/re9cyhkt/items?query=darwin`, page);
};

const itemWithReferenceNumber = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/qqra7v28/items`, page);
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

const workWithDigitalLocationAndRestricted = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/jjdp9v65`, page);
};

const workWithDigitalLocationAndLocationNote = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/a235xn8e`, page);
};

const workWithBornDigitalDownloads = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/htzhunbw`, page);
};

const search = async (
  context: BrowserContext,
  page: Page,
  searchType:
    | 'overview'
    | 'stories'
    | 'events'
    | 'images'
    | 'works' = 'overview'
): Promise<void> => {
  await context.addCookies(requiredCookies);

  const searchUrl = `search${
    searchType === 'overview' ? `` : `/${searchType}`
  }`;
  await gotoWithoutCache(`${baseUrl}/${searchUrl}`, page);
};

const article = async (
  id: string,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/stories/${id}`, page);
};

const articleWithMockSiblings = async (
  id: string,
  response: prismic.Query<RawArticlesDocument>,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.route('**/api/**', route =>
    route.fulfill({
      status: 200,
      body: JSON.stringify(response),
    })
  );
  await gotoWithoutCache(`${baseUrl}/stories/${id}`, page);
};

const concept = async (
  id: string,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/concepts/${id}`, page);
};

const event = async (
  id: string,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/events/${id}`, page);
};

const visualStory = async (
  id: string,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/visual-stories/${id}`, page);
};

const digitalGuide = async (
  path: string,
  context: BrowserContext,
  page: Page,
  cookies: CookieProps[]
): Promise<void> => {
  await context.addCookies([...requiredCookies, ...cookies]);
  await gotoWithoutCache(`${baseUrl}/guides/exhibitions/${path}`, page);
};

const whatsOn = async (context: BrowserContext, page: Page): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/whats-on`, page);
};

const mediaOffice = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/about-us/press`, page);
};

const newOnline = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/collections/new-online`, page);
};

const apiToolbarPage = async (
  id: string,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies([
    ...requiredCookies,
    {
      name: 'toggle_apiToolbar',
      value: 'true',
      domain: new URL(baseUrl).host,
      path: '/',
    },
  ]);
  await gotoWithoutCache(`${baseUrl}/${id}`, page);
};

const isMobile = (page: Page): boolean =>
  (page.viewportSize()?.width ?? 0) <= devices['iPhone 11'].viewport.width;

export {
  article,
  articleWithMockSiblings,
  concept,
  digitalGuide,
  event,
  isMobile,
  itemWithAltText,
  itemWithNonRestrictedAndOpenAccess,
  itemWithOnlyOpenAccess,
  itemWithOnlyRestrictedAccess,
  itemWithReferenceNumber,
  itemWithRestrictedAndNonRestrictedAccess,
  itemWithRestrictedAndOpenAccess,
  itemWithSearchAndStructures,
  itemWithSearchAndStructuresAndQuery,
  mediaOffice,
  multiVolumeItem,
  apiToolbarPage,
  search,
  visualStory,
  whatsOn,
  newOnline,
  workWithBornDigitalDownloads,
  workWithDigitalLocationAndLocationNote,
  workWithDigitalLocationAndRestricted,
  workWithDigitalLocationOnly,
  workWithPhysicalLocationOnly,
};
