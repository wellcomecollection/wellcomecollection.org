import { test, expect } from '@playwright/test';
import {
  workWithPhysicalLocationOnly,
  workWithDigitalLocationOnly,
  workWithDigitalLocationAndLocationNote,
} from './helpers/contexts';
import { Page } from 'playwright';

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

test.describe(`Scenario 1: a user wants to see relevant information about where a work's items are located`, () => {
  test(`works that have a physical item location display a 'Where to find it' section with a link`, async ({
    page,
    context,
  }) => {
    await workWithPhysicalLocationOnly(context, page);
    const { whereToFindIt, loginLink, unavailableBanner } = await getAllStates(
      page
    );

    await expect(whereToFindIt).toBeVisible();

    await expect(loginLink.or(unavailableBanner)).not.toBeVisible(); // TODO: Revert before merge. Fail test in order to have access to e2e environment
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
