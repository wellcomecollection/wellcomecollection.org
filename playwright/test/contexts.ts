import { baseUrl, useStageApis } from './helpers/urls';
import { Response } from 'playwright';
export function gotoWithoutCache(url: string): Promise<null | Response> {
  return page.goto(`${url}?cachebust=${Date.now()}`);
}

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

const multiVolumeItem = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/mg56yqa4/items`);
};

const itemWithAltText = async (params: {
  canvasNumber?: number;
}): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(
    `${baseUrl}/works/pzmyhgsk/items${
      params.canvasNumber ? `?canvas=${params.canvasNumber}` : ''
    }`
  );
};

const itemWithOnlyOpenAccess = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/w8t2vh3w/items`);
};
const itemWithOnlyRestrictedAccess = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/zg3pt2bp/items`);
};
const itemWithRestrictedAndOpenAccess = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/p9gepwjs/items`);
};
const itemWithRestrictedAndNonRestrictedAccess = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/jsmqcwvt/items`);
};
const itemWithNonRestrictedAndOpenAccess = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/fa7pymra/items`);
};

const itemWithSearchAndStructures = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/re9cyhkt/items`);
};

const workWithPhysicalLocationOnly = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/ffd3zeq3`);
};

const workWithDigitalLocationOnly = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/j9kukb78`);
};

const workWithDigitalLocationAndLocationNote = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/a235xn8e`);
};

const workWithPhysicalAndDigitalLocation = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/works/r9kpkq8e`);
};

const itemWithReferenceNumber = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works/qqra7v28/items`);
};

const worksSearch = async (): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/works`);
};

const article = async (id: string): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/articles/${id}`);
};

const articleWithMockSiblings = async (
  id: string,
  response: Record<string, any>
): Promise<void> => {
  await context.route('**/api/**', route =>
    route.fulfill({
      status: 200,
      body: JSON.stringify(response),
    })
  );
  await gotoWithoutCache(`${baseUrl}/articles/${id}`);
};

export const event = async (id: string): Promise<void> => {
  context.addCookies(requiredCookies);
  await gotoWithoutCache(`${baseUrl}/events/${id}`);
};

export const isMobile = Boolean(deviceName);

export {
  multiVolumeItem,
  itemWithAltText,
  worksSearch,
  itemWithSearchAndStructures,
  itemWithReferenceNumber,
  workWithPhysicalAndDigitalLocation,
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
};
