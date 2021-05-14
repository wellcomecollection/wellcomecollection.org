import {
  workWithPhysicalAndDigitalLocation,
  workWithPhysicalLocationOnly,
  workWithDigitalLocationOnly,
} from './contexts';
import { makeDefaultToggleAndTestCookies } from './helpers/utils';
import { baseUrl } from './helpers/urls';

const domain = new URL(baseUrl).host;

// Turn on the showPhysicalItems toggle
beforeAll(async () => {
  const defaultToggleAndTestCookies = await makeDefaultToggleAndTestCookies(
    domain
  );
  const toggleOverrides = [
    {
      name: 'toggle_showPhysicalItems',
      value: 'true',
    },
  ];
  const overriddenCookies = defaultToggleAndTestCookies.map(cookie => {
    const matchingOverrideCookie = toggleOverrides.find(
      override => override.name === cookie.name
    );
    if (matchingOverrideCookie) {
      return {
        ...cookie,
        value: matchingOverrideCookie.value,
      };
    } else {
      return cookie;
    }
  });
  await context.addCookies([
    { name: 'WC_cookiesAccepted', value: 'true', domain: domain, path: '/' },
    { name: 'WC_globalAlert', value: 'true', domain: domain, path: '/' },
    ...overriddenCookies,
  ]);
});

async function getWhereToFindItAndEncoreLink() {
  const whereToFindIt = await page.$('h2:has-text("Where to find it")');
  const encoreLink = await page.$('a:has-text("Request item")');

  return {
    whereToFindIt,
    encoreLink,
  };
}

describe.only(`Scenario 1: a user wants to see relevant information about where a work's items are located and the access status of those items`, () => {
  test(`works with a physical location item only display a 'where to find it' section with a link`, async () => {
    await workWithPhysicalLocationOnly();
    const { whereToFindIt, encoreLink } = await getWhereToFindItAndEncoreLink();
    expect(whereToFindIt).toBeTruthy();
    expect(encoreLink).toBeTruthy();
  });

  test(`works with a physical and digital location item display a 'where to find it' section without a link`, async () => {
    await workWithPhysicalAndDigitalLocation();
    const { whereToFindIt, encoreLink } = await getWhereToFindItAndEncoreLink();
    expect(whereToFindIt).toBeTruthy();
    expect(encoreLink).toBeNull();
  });

  test(`works with a digital location only don't display a 'where to find it' section`, async () => {
    await workWithDigitalLocationOnly();
    const { whereToFindIt, encoreLink } = await getWhereToFindItAndEncoreLink();
    expect(whereToFindIt).toBeNull();
    expect(encoreLink).toBeNull();
  });
});
