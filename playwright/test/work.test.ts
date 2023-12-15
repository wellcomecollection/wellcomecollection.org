import { test, expect } from '@playwright/test';
import {
  workWithPhysicalLocationOnly,
  workWithDigitalLocationOnly,
  workWithDigitalLocationAndLocationNote,
} from './helpers/contexts';
import { Page } from 'playwright';

const getWhereToFindItAndEncoreLink = async (page: Page) => {
  const whereToFindIt = await page.$('h2:has-text("Where to find it")');
  const encoreLink = await page.$('a:has-text("Request item")');
  const unavailableBanner = await page.getByTestId('requesting-disabled');

  return {
    whereToFindIt,
    encoreLink,
    unavailableBanner,
  };
};

const getAvailableOnline = async (page: Page) => {
  const availableOnline = await page.$('h2:has-text("Available online")');
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

    expect(whereToFindIt).toBeTruthy();
    expect(encoreLink || unavailableBanner).toBeTruthy();
  });

  test(`works with only a physical location don't display an 'Available online' section`, async ({
    page,
    context,
  }) => {
    await workWithPhysicalLocationOnly(context, page);
    const availableOnline = await getAvailableOnline(page);
    expect(availableOnline).toBeNull();
  });

  test(`works with a digital item display an 'Available online' section`, async ({
    page,
    context,
  }) => {
    await workWithDigitalLocationAndLocationNote(context, page);
    const availableOnline = await getAvailableOnline(page);
    expect(availableOnline).toBeTruthy();
  });

  test(`works with only a digital location don't display a 'Where to find it' section`, async ({
    page,
    context,
  }) => {
    await workWithDigitalLocationOnly(context, page);
    const { whereToFindIt } = await getWhereToFindItAndEncoreLink(page);
    expect(whereToFindIt).toBeNull();
  });

  test(`works that have a note with a noteType.id of 'location-of-original', display a 'Where to find it' section`, async ({
    page,
    context,
  }) => {
    await workWithDigitalLocationAndLocationNote(context, page);
    const { whereToFindIt } = await getWhereToFindItAndEncoreLink(page);
    expect(whereToFindIt).toBeTruthy();
  });
});
