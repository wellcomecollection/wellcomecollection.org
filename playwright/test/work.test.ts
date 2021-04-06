import {
  workWithPhysicalAndDigitalLocation,
  workWithPhysicalLocationOnly,
  workWithDigitalLocationOnly,
} from './contexts';

async function getWhereToFindItAndEncoreLink() {
  const whereToFindIt = await page.$('h2:has-text("Where to find it")');
  const encoreLink = await page.$(
    'a:has-text("Access this item on the Wellcome Library website")'
  );

  return {
    whereToFindIt,
    encoreLink,
  };
}
describe('Scenario: a user sees relevant information about a work they are viewing', () => {
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
