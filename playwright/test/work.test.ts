import { test, expect } from '@playwright/test';
import {
  workWithPhysicalLocationOnly,
  workWithDigitalLocationOnly,
  workWithDigitalLocationAndLocationNote,
} from './helpers/contexts';
import { Page } from 'playwright';

const getWhereToFindItAndEncoreLink = async (page: Page) => {
  const whereToFindIt = await page.getByRole('heading', {
    name: 'Where to find it',
  });

  const encoreLink = await page.getByRole('link', {
    name: 'Request item',
  });

  const unavailableBanner = await page.getByTestId('requesting-disabled');

  return {
    whereToFindIt,
    encoreLink,
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
    const { whereToFindIt, encoreLink, unavailableBanner } =
      await getWhereToFindItAndEncoreLink(page);

    await expect(whereToFindIt).toBeVisible();

    const encoreLinkIsVisible = await encoreLink.isVisible();
    const unavailableBannerIsVisible = await unavailableBanner.isVisible();

    expect(encoreLinkIsVisible || unavailableBannerIsVisible).toBe(true);
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
    const { whereToFindIt } = await getWhereToFindItAndEncoreLink(page);
    await expect(whereToFindIt).toHaveCount(0);
  });

  test(`works that have a note with a noteType.id of 'location-of-original', display a 'Where to find it' section`, async ({
    page,
    context,
  }) => {
    await workWithDigitalLocationAndLocationNote(context, page);
    const { whereToFindIt } = await getWhereToFindItAndEncoreLink(page);
    await expect(whereToFindIt).toBeVisible();
  });
});
