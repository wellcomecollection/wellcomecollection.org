import { BrowserContext, Page } from 'playwright';
import { baseUrl, useStageApis } from './helpers/urls';
import { devices } from '@playwright/test';

export const gotoWithoutCache = (url: string, page: Page) => {
  return page.goto(`${url}?cachebust=${Date.now()}`);
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

const worksSearch = async (
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works`, page);
};

const article = async (
  id: string,
  context: BrowserContext,
  page: Page
): Promise<void> => {
  await context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/articles/${id}`, page);
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
  itemWithAltText,
  worksSearch,
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
  isMobile,
};
