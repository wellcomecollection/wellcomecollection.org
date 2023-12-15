import { test as base, expect } from '@playwright/test';
import { workWithPhysicalLocationOnly } from './helpers/contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleCookies } from './helpers/utils';

const domain = new URL(baseUrl).host;

const test = base.extend({
  context: async ({ context }, use) => {
    const defaultToggleCookies = await makeDefaultToggleCookies(domain);
    await context.addCookies(defaultToggleCookies);
    await use(context);
  },
});

test.describe.skip('Scenario 1: researcher is logged out', () => {
  test('Link to login/registration is displayed', () => {
    // Log out
    // Go to item page with requestable items
    // Expect link to login/registration page
  });
});

test.describe.skip('Scenario 2: researcher is not a library member', () => {
  test('Information about registering for library membership is displayed', () => {
    // Log out
    // Go to login/register page
    // Expect information about joining library
    // Expect registration button
  });
});

test.describe.skip('Scenario 3: researcher is a library member', () => {
  test('Researcher can log in', () => {
    // Log out
    // Go to Login/register page
    // Expect login form
    // Fill in username and password
    // Submit form
    // Expect to be logged in
  });
});

test.describe.skip('Scenario 4: researcher is logged in', () => {
  test('Items display their requestability', async ({ page, context }) => {
    // TODO: Log in instead of setting toggle
    await workWithPhysicalLocationOnly(context, page);
    const requestButtons = await page.$$('button:has-text("Request item")');
    expect(requestButtons.length).toBe(2);
  });
});

test.describe.skip('Scenario 5: researcher initiates item request', () => {
  test('Account indicates number of remaining requests', async ({
    page,
    context,
  }) => {
    await workWithPhysicalLocationOnly(context, page);
    await page.click('button:has-text("Request item")');
    const itemsRequested = await page.$(':has-text("8/15 items requested")');
    expect(itemsRequested).toBeTruthy();
  });

  test('Researcher can cancel request', async ({ page, context }) => {
    await workWithPhysicalLocationOnly(context, page);
    await page.click('button:has-text("Request item")');
    await page.click('button:has-text("Cancel request")');
    const requestButtons = await page.$$('button:has-text("Request item")');
    expect(requestButtons.length).toBe(2);
  });
});

test.describe.skip('Scenario 6: researcher confirms item request', () => {
  test('Researcher can confirm request', async ({ page, context }) => {
    await workWithPhysicalLocationOnly(context, page);
    await page.click('button:has-text("Request item")');
    await page.click('button:has-text("Confirm request")');
    await page.waitForSelector(':has-text("Request confirmed")');
    await page.waitForSelector(':has-text("9/15 items requested")');
  });
});
