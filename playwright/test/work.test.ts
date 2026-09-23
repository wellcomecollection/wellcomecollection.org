import { Page } from 'playwright';

import { expect, test } from './helpers/analytics-blocking';
import {
  workWithBornDigitalItem,
  workWithDigitalLocationAndLocationNote,
  workWithDigitalLocationAndRestricted,
  workWithDigitalLocationOnly,
  workWithPhysicalLocationOnly,
} from './helpers/contexts';

const getAllStates = async (page: Page) => {
  const whereToFindIt = page.getByRole('heading', {
    name: 'Where to find it',
  });

  const loginLink = page.getByRole('link', {
    name: 'sign in to your library account to request items',
  });

  const unavailableBanner = page.getByTestId('requesting-disabled');

  return {
    whereToFindIt,
    loginLink,
    unavailableBanner,
  };
};

const getAvailableOnline = async (page: Page) => {
  const availableOnline = await page.getByRole('heading', {
    name: 'Available online',
  });
  return availableOnline;
};

test.describe(`(1) | a user wants to see relevant information about where a work's items are located`, () => {
  test(`works that have a physical item location display a 'Where to find it' section with a link`, async ({
    page,
    context,
  }) => {
    await workWithPhysicalLocationOnly(context, page);
    const { whereToFindIt, loginLink, unavailableBanner } =
      await getAllStates(page);

    await expect(whereToFindIt).toBeVisible();

    await expect(loginLink.or(unavailableBanner)).toBeVisible();
  });

  test(`works with only a physical location don't display an 'Available online' section`, async ({
    page,
    context,
  }) => {
    await workWithPhysicalLocationOnly(context, page);
    const availableOnline = await getAvailableOnline(page);

    await expect(availableOnline).toHaveCount(0);
  });

  test(`works with a digital item display an 'Available online' section`, async ({
    page,
    context,
  }) => {
    await workWithDigitalLocationAndLocationNote(context, page);
    const availableOnline = await getAvailableOnline(page);
    await expect(availableOnline).toBeVisible();
  });

  test(`works with a digital location don't display an 'Available online' section if the work is restricted and the user doesn't have a role of 'StaffWithRestricted'`, async ({
    page,
    context,
  }) => {
    await workWithDigitalLocationAndRestricted(context, page);
    const availableOnline = await getAvailableOnline(page);
    await expect(availableOnline).toHaveCount(0);
  });

  test(`works with only a digital location don't display a 'Where to find it' section`, async ({
    page,
    context,
  }) => {
    await workWithDigitalLocationOnly(context, page);
    const { whereToFindIt } = await getAllStates(page);
    await expect(whereToFindIt).toHaveCount(0);
  });

  test(`works that have a note with a noteType.id of 'location-of-original', display a 'Where to find it' section`, async ({
    page,
    context,
  }) => {
    await workWithDigitalLocationAndLocationNote(context, page);
    const { whereToFindIt } = await getAllStates(page);
    await expect(whereToFindIt).toBeVisible();
  });
});

test.describe(`(2) | A user follows the 'View' link from the work page to the item page`, () => {
  test(`clicking 'View' on a standard work takes the user to its item page`, async ({
    page,
    context,
  }) => {
    await workWithDigitalLocationAndLocationNote(context, page);

    await page.getByRole('link', { name: 'View', exact: true }).click();

    await expect(page).toHaveURL(/\/works\/a235xn8e\/items/);
  });

  test(`a born-digital work shows the born-digital message, and clicking 'View' takes the user to its item page`, async ({
    page,
    context,
  }) => {
    await workWithBornDigitalItem(context, page);

    await expect(
      page.getByRole('heading', { name: 'This contains born-digital items' })
    ).toBeVisible();

    await page.getByRole('link', { name: 'View', exact: true }).click();

    await expect(page).toHaveURL(/\/works\/yhgvjsga\/items/);
  });
});
