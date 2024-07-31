import { test, expect } from '@playwright/test';
import {
  workWithPhysicalLocationOnly,
  workWithDigitalLocationOnly,
  workWithDigitalLocationAndLocationNote,
  isMobile,
  workWithBornDigitalDownloads,
} from './helpers/contexts';
import { Page } from 'playwright';

declare global {
  interface Window {
    dataLayer: { [key: string]: string }[];
  }
}

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

test.describe(`Scenario 2: A user viewing/downloading 'born digital' items`, () => {
  test(`ArchiveTree.ListItems stays open when inner item is clicked`, async ({
    page,
    context,
  }) => {
    await workWithBornDigitalDownloads(context, page);
    const innerTreeItem = page.getByRole('treeitem', {
      name: 'A_Camels.psd vnd.adobe.photoshop 6.1 MB Download',
    });

    await expect(innerTreeItem).not.toBeVisible();

    await page
      .getByRole('treeitem', {
        name: 'objects',
      })
      .click();

    await expect(innerTreeItem).toBeVisible();
    await innerTreeItem.click();
    await expect(innerTreeItem).toBeVisible();
  });

  test(`ArchiveTree.ListItems Download link fires GTM trigger`, async ({
    page,
    context,
  }) => {
    if (!isMobile(page)) {
      await workWithBornDigitalDownloads(context, page);

      await page
        .getByRole('treeitem', {
          name: 'objects',
        })
        .click();

      await page
        .getByRole('link', {
          name: 'Download',
        })
        .first()
        .click();

      const dataLayer = await page.evaluate(() => window.dataLayer);
      const clickEvent = dataLayer.find(
        (item: { [x: string]: string }) =>
          item?.['gtm.elementText'] === 'Download'
      );
      const gtmTriggers = clickEvent?.['gtm.triggers'].split(',');
      const DOWNLOAD_TABLE_LINK_TRIGGER = '31009043_218'; // ID that is discoverable through GTM preview
      expect(gtmTriggers).toEqual(
        expect.arrayContaining([DOWNLOAD_TABLE_LINK_TRIGGER])
      );
    }
  });
});
