import {
  workWithPhysicalLocationOnly,
  workWithDigitalLocationOnly,
  workWithDigitalLocationAndLocationNote,
} from './contexts';

async function getWhereToFindItAndEncoreLink() {
  const whereToFindIt = await page.$('h2:has-text("Where to find it")');
  const encoreLink = await page.$('a:has-text("Request item")');
  const unavailableBanner = await page.$(
    'span:has-text("Requesting is currently unavailable, while our building is closed.")'
  );

  return {
    whereToFindIt,
    encoreLink,
    unavailableBanner,
  };
}

async function getAvailableOnline() {
  const availableOnline = await page.$('h2:has-text("Available online")');
  return availableOnline;
}

describe(`Scenario 1: a user wants to see relevant information about where a work's items are located`, () => {
  test(`works that have a physical item location display a 'Where to find it' section with a link`, async () => {
    await workWithPhysicalLocationOnly();
    const { whereToFindIt, encoreLink, unavailableBanner } =
      await getWhereToFindItAndEncoreLink();
    expect(whereToFindIt).toBeTruthy();

    // TODO: Remove the check for the unavailableBanner when the building is reopened.
    expect(encoreLink || unavailableBanner).toBeTruthy();
  });

  test(`works with only a physical location don't display an 'Available online' section`, async () => {
    await workWithPhysicalLocationOnly();
    const availableOnline = await getAvailableOnline();
    expect(availableOnline).toBeNull();
  });

  test(`works with a digital item display an 'Available online' section`, async () => {
    await workWithDigitalLocationAndLocationNote();
    const availableOnline = await getAvailableOnline();
    expect(availableOnline).toBeTruthy();
  });

  test(`works with only a digital location don't display a 'Where to find it' section`, async () => {
    await workWithDigitalLocationOnly();
    const { whereToFindIt } = await getWhereToFindItAndEncoreLink();
    expect(whereToFindIt).toBeNull();
  });

  test(`works that have a note with a noteType.id of 'location-of-original', display a 'Where to find it' section`, async () => {
    await workWithDigitalLocationAndLocationNote();
    const { whereToFindIt } = await getWhereToFindItAndEncoreLink();
    expect(whereToFindIt).toBeTruthy();
  });
});
