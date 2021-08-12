import { workWithPhysicalLocationOnly } from './contexts';
import { baseUrl } from './helpers/urls';
import { makeDefaultToggleAndTestCookies } from './helpers/utils';

const domain = new URL(baseUrl).host;

beforeAll(async () => {
  const defaultToggleAndTestCookies = await makeDefaultToggleAndTestCookies(
    domain
  );
  await context.addCookies([
    {
      name: 'toggle_showItemRequestFlow',
      value: 'true',
      domain: domain,
      path: '/',
    },
    ...defaultToggleAndTestCookies,
  ]);
});

describe.skip('Scenario 1: researcher is logged out', () => {
  test('Link to login/registration is displayed', () => {
    // Log out
    // Go to item page with requestable items
    // Expect link to login/registration page
  });
});

describe.skip('Scenario 2: researcher is not a library member', () => {
  test('Information about registering for library membership is displayed', () => {
    // Log out
    // Go to login/register page
    // Expect information about joining library
    // Expect registration button
  });
});

describe.skip('Scenario 3: researcher is a library member', () => {
  test('Researcher can log in', () => {
    // Log out
    // Go to Login/register page
    // Expect login form
    // Fill in username and password
    // Submit form
    // Expect to be logged in
  });
});

describe.skip('Scenario 4: researcher is logged in', () => {
  test('Items display their requestability', async () => {
    // TODO: Log in instead of setting toggle
    await workWithPhysicalLocationOnly();
    const requestButtons = await page.$$('button:has-text("Request item")');
    expect(requestButtons.length).toBe(2);
  });
});

describe.skip('Scenario 5: researcher initiates item request', () => {
  beforeAll(async () => {
    // TODO: Log in instead of setting toggle
    await workWithPhysicalLocationOnly();
    await page.click('button:has-text("Request item")');
  });

  test('Account indicates number of remaining requests', async () => {
    const remainingRequests = await page.$(':has-text("7/15 items remaining")');
    expect(remainingRequests).toBeTruthy();
  });

  test('Researcher can cancel request', async () => {
    await page.click('button:has-text("Cancel request")');
    const requestButtons = await page.$$('button:has-text("Request item")');
    expect(requestButtons.length).toBe(2);
  });
});

describe.skip('Scenario 6: researcher confirms item request', () => {
  beforeAll(async () => {
    // TODO: Log in instead of setting toggle
    await workWithPhysicalLocationOnly();
    await page.click('button:has-text("Request item")');
  });

  test('Researcher can confirm request', async () => {
    await page.click('button:has-text("Confirm request")');
    await page.waitForSelector(':has-text("Request confirmed")');
    await page.waitForSelector(':has-text("6/15 items remaining")');
    await page.waitForSelector('a:has-text("Book a ticket")');
  });
});
