import { expect, test } from '@playwright/test';
import { BrowserContext, Page } from 'playwright';

import { gotoWithoutCache } from './helpers/contexts';
import { baseUrl, useStageApis } from './helpers/utils';

/**
 * Helper to create cookies needed for kiosk mode testing
 */
const createKioskModeCookie = (kioskMode: string) => {
  return {
    name: 'toggle_kioskMode',
    value: kioskMode,
    path: '/',
    domain: new URL(baseUrl).host,
  };
};

const acceptCookieCookie = {
  name: 'CookieControl',
  value: '{}',
  path: '/',
  domain: new URL(baseUrl).host,
};

const stageApiToggleCookie = {
  name: 'toggle_stagingApi',
  value: 'true',
  path: '/',
  domain: new URL(baseUrl).host,
};

/**
 * Helper to set up a kiosk context with the required cookies
 */
const setupKioskContext = async (
  context: BrowserContext,
  kioskMode: string
): Promise<void> => {
  const cookies = [acceptCookieCookie, createKioskModeCookie(kioskMode)];
  if (useStageApis) {
    cookies.push(stageApiToggleCookie);
  }
  await context.addCookies(cookies);
};

/**
 * Helper to navigate to a work page in kiosk mode
 */
const gotoWorkInKioskMode = async (
  workId: string,
  context: BrowserContext,
  page: Page,
  kioskMode = 'TR-iPad1'
): Promise<void> => {
  await setupKioskContext(context, kioskMode);
  await gotoWithoutCache(`${baseUrl}/works/${workId}`, page);
};

/**
 * Helper to navigate to a story page in kiosk mode
 */
const gotoStoryInKioskMode = async (
  storyId: string,
  context: BrowserContext,
  page: Page,
  kioskMode = 'TR-iPad1'
): Promise<void> => {
  await setupKioskContext(context, kioskMode);
  await gotoWithoutCache(`${baseUrl}/stories/${storyId}`, page);
};

// Browser history navigation tests
test('(1) | Browser back button is disabled on the first page', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  const backButton = page.getByRole('button', {
    name: 'Go back to previous page',
  });

  await expect(backButton).toBeDisabled();
});

test('(2) | Browser back button becomes enabled after navigating to multiple pages', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  // Navigate to another work
  await page.getByRole('link', { name: 'Go to next page' }).click();
  await page.waitForLoadState('networkidle');

  const backButton = page.getByRole('button', {
    name: 'Go back to previous page',
  });

  await expect(backButton).toBeEnabled();
});

test('(3) | Browser back button navigates to the previous page', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);
  const firstWorkTitle = await page.title();

  // Navigate to next work
  await page.getByRole('link', { name: 'Go to next page' }).click();
  await page.waitForLoadState('networkidle');
  const secondWorkTitle = await page.title();

  // Verify we're on a different page
  expect(firstWorkTitle).not.toBe(secondWorkTitle);

  // Click back
  const backButton = page.getByRole('button', {
    name: 'Go back to previous page',
  });
  await backButton.click();
  await page.waitForLoadState('networkidle');

  // Verify we're back on the first page
  const currentTitle = await page.title();
  expect(currentTitle).toBe(firstWorkTitle);
});

test('(4) | Browser forward button is disabled initially', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  const forwardButton = page.getByRole('button', {
    name: 'Go forward to next page',
  });

  await expect(forwardButton).toBeDisabled();
});

test('(5) | Browser forward button becomes enabled after going back', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  // Navigate to next work
  await page.getByRole('link', { name: 'Next' }).click();
  await page.waitForLoadState('networkidle');

  // Go back
  const backButton = page.getByRole('button', {
    name: 'Go back to previous page',
  });
  await backButton.click();
  await page.waitForLoadState('networkidle');

  // Forward button should now be enabled
  const forwardButton = page.getByRole('button', {
    name: 'Go forward to next page',
  });
  await expect(forwardButton).toBeEnabled();
});

test('(6) | Browser forward button navigates to the next page in history', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  // Navigate to next work
  await page.getByRole('link', { name: 'Go to next page' }).click();
  await page.waitForLoadState('networkidle');
  const secondWorkTitle = await page.title();

  // Go back
  const backButton = page.getByRole('button', {
    name: 'Go back to previous page',
  });
  await backButton.click();
  await page.waitForLoadState('networkidle');

  // Go forward
  const forwardButton = page.getByRole('button', {
    name: 'Go forward to next page',
  });
  await forwardButton.click();
  await page.waitForLoadState('networkidle');

  // Verify we're back on the second page
  const currentTitle = await page.title();
  expect(currentTitle).toBe(secondWorkTitle);
});

test('(7) | Browser forward button is disabled after navigating to a new page from history', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  // Navigate to next work
  await page.getByRole('link', { name: 'Go to next page' }).click();
  await page.waitForLoadState('networkidle');

  // Go back
  const backButton = page.getByRole('button', {
    name: 'Go back to previous page',
  });
  await backButton.click();
  await page.waitForLoadState('networkidle');

  // Navigate to home (or any new page)
  const homeLink = page.getByRole('link', {
    name: 'Return to kiosk home page',
  });
  await homeLink.click();
  await page.waitForLoadState('networkidle');

  // Forward button should now be disabled (forward history cleared)
  const forwardButton = page.getByRole('button', {
    name: 'Go forward to next page',
  });
  await expect(forwardButton).toBeDisabled();
});

// Content navigation tests (Previous/Next)
test('(8) | Next button is enabled when not on the last work', async ({
  page,
  context,
}) => {
  // Navigate to the first work in the TR kiosk includedWorks list
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  const nextLink = page.getByRole('link', { name: 'Go to next page' });
  await expect(nextLink).toBeVisible();
});

test('(9) | Previous button is disabled on the first work', async ({
  page,
  context,
}) => {
  // Navigate to the first work in the TR kiosk includedWorks list
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  const prevDisabled = page.getByLabel('Previous page unavailable');
  await expect(prevDisabled).toBeVisible();
});

test('(10) | Next button navigates to the next work in the list', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);
  const firstWorkUrl = page.url();

  // Click next
  await page.getByRole('link', { name: 'Go to next page' }).click();
  await page.waitForLoadState('networkidle');

  const secondWorkUrl = page.url();
  expect(secondWorkUrl).not.toBe(firstWorkUrl);

  // Verify we're still in kiosk mode
  const kioskNav = page.getByLabel('Kiosk navigation');
  await expect(kioskNav).toBeVisible();
});

test('(11) | Previous button is enabled after navigating to the second work', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  // Navigate to next work
  await page.getByRole('link', { name: 'Go to next page' }).click();
  await page.waitForLoadState('networkidle');

  // Previous button should now be visible and enabled
  const prevLink = page.getByRole('link', { name: 'Go to previous page' });
  await expect(prevLink).toBeVisible();
});

test('(12) | Previous button navigates to the previous work in the list', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);
  const firstWorkUrl = page.url();

  // Navigate to next work
  await page.getByRole('link', { name: 'Go to next page' }).click();
  await page.waitForLoadState('networkidle');

  // Navigate back with Prev button
  await page.getByRole('link', { name: 'Go to previous page' }).click();
  await page.waitForLoadState('networkidle');

  const currentUrl = page.url();
  expect(currentUrl).toBe(firstWorkUrl);
});

test('(13) | Next button is disabled on the last work in the list', async ({
  page,
  context,
}) => {
  // Navigate to the last work in the TR kiosk includedWorks list
  // Based on the kiosks-content.ts file, the last work is 'zxyeupbh'
  await gotoWorkInKioskMode('zxyeupbh', context, page);

  const nextDisabled = page.getByLabel('Next page unavailable');
  await expect(nextDisabled).toBeVisible();
});

// Progress indicator tests
test('(14) | Progress counter shows correct position for first work', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  // The TR includedWorks list has 8 works, so first work should show 1 / 8
  const counter = page.getByLabel(/Page 1 of \d+/);
  await expect(counter).toBeVisible();
});

test('(15) | Progress counter updates when navigating to next work', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  // Navigate to next work
  await page.getByRole('link', { name: 'Go to next page' }).click();
  await page.waitForLoadState('networkidle');

  // Should now show 2 / 8
  const counter = page.getByLabel(/Page 2 of \d+/);
  await expect(counter).toBeVisible();
});

test('(16) | Related works label is shown for work pages', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  const label = page.getByLabel(/Viewing related works/);
  await expect(label).toBeVisible();
});

test('(17) | Related stories label is shown for story pages', async ({
  page,
  context,
}) => {
  // Navigate to the first story in the TR kiosk stories list
  await gotoStoryInKioskMode('artists--activism-and-aids', context, page);

  const label = page.getByLabel(/Viewing related stories/);
  await expect(label).toBeVisible();
});

// Home button test
test('(18) | Home button is always visible in kiosk mode', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  const homeLink = page.getByRole('link', {
    name: 'Return to kiosk home page',
  });
  await expect(homeLink).toBeVisible();
});

test('(19) | Home button navigates to the kiosk home page', async ({
  page,
  context,
}) => {
  await gotoWorkInKioskMode('eudv2vbg', context, page);

  const homeLink = page.getByRole('link', {
    name: 'Return to kiosk home page',
  });
  await homeLink.click();
  await page.waitForLoadState('networkidle');

  // Verify we navigated away from the work page
  expect(page.url()).not.toContain('/works/');

  // Kiosk navigation should still be visible on the home page
  const kioskNav = page.getByLabel('Kiosk navigation');
  await expect(kioskNav).toBeVisible();
});
