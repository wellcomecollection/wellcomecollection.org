import { BrowserContext, Locator, Page } from '@playwright/test';

import { expect, test } from './helpers/analytics-blocking';
import { isMobile, search } from './helpers/contexts';
import { openFilterDropdown, searchQuerySubmitAndWait } from './helpers/search';
import { baseUrl } from './helpers/utils';

// Acceptance criteria from https://github.com/wellcomecollection/wellcomecollection.org/issues/13529
//
// These run with the imageSidebarPhases toggle at Phase 1. A test marked
// `fixme` covers a criterion a later PR delivers; take the `fixme` off in
// that PR.
test.describe.configure({ mode: 'parallel' });

const enableImageSidebar = (context: BrowserContext) =>
  context.addCookies([
    {
      name: 'toggle_imageSidebarPhases',
      value: 'phase1',
      path: '/',
      domain: new URL(baseUrl).hostname,
    },
  ]);

const resultsGrid = (page: Page) =>
  page.getByTestId('image-search-results-container');

// The nth image in the results, counting from 1
const thumbnail = (page: Page, nthChild: number) =>
  resultsGrid(page)
    .getByRole('link')
    .nth(nthChild - 1);

// Each thumbnail's title, from its alt text. Empty where the title has display
// markup in it (<i>, <sup>), as the sidebar shows that formatted, so it
// wouldn't match.
const plainThumbnailTitles = (page: Page) =>
  resultsGrid(page)
    .getByRole('link')
    .evaluateAll(links =>
      links.map(link => {
        const alt = link.querySelector('img')?.getAttribute('alt') ?? '';
        return alt.includes('<') ? '' : alt.replace(/\s+/g, ' ').trim();
      })
    );

// Something inside the element has focus
const expectFocusInside = (element: Locator) =>
  expect(element.locator(':focus')).toHaveCount(1);

// The region that holds the close button; its name differs between versions
// (labelled by the image's title, then "Image details"), so it isn't used
const sidebar = (page: Page) =>
  page
    .getByRole('region')
    .filter({ has: page.getByRole('button', { name: 'Close image details' }) });

const searchImages = async (
  query: string,
  context: BrowserContext,
  page: Page
) => {
  await enableImageSidebar(context);
  await search(context, page, 'images');
  await searchQuerySubmitAndWait(query, page);
};

const openSidebar = async (nthChild: number, page: Page) => {
  await thumbnail(page, nthChild).click();
  await expect(sidebar(page)).toBeVisible();
};

// An image with a contributor and visually similar images, also used in
// search-images.test.ts. The content test below checks that record's details
// from the live catalogue, so it follows any edit to it.
const imageWithContributor = 'fcmwqd5u';

// The sidebar sits beside the grid on desktop; on small screens it becomes a
// layer over the grid, which is covered separately at the end.
test.describe('Desktop', () => {
  test.beforeEach(({ page }) => {
    test.skip(isMobile(page), 'Desktop layout');
  });

  test.describe('Opening the sidebar', () => {
    test('clicking an image opens a sidebar to the right of the grid, which stays visible', async ({
      page,
      context,
    }) => {
      await searchImages(imageWithContributor, context, page);
      await openSidebar(1, page);

      const grid = await resultsGrid(page).boundingBox();
      const pane = await sidebar(page).boundingBox();
      expect(grid).not.toBeNull();
      expect(pane).not.toBeNull();

      // Beside the grid, not on top of it (allowing a pixel of rounding)
      expect(pane!.x).toBeGreaterThanOrEqual(grid!.x + grid!.width - 1);
      await expect(resultsGrid(page)).toBeVisible();
    });

    // https://github.com/wellcomecollection/wellcomecollection.org/issues/13534
    test.fixme('the selected thumbnail shows it is the one open in the sidebar', async ({
      page,
      context,
    }) => {
      await searchImages(imageWithContributor, context, page);
      await openSidebar(1, page);

      await expect(thumbnail(page, 1)).toHaveAttribute('aria-current', 'true');
      await expect(thumbnail(page, 2)).not.toHaveAttribute('aria-current');
    });

    test('with the toggle off, clicking an image opens the modal, not the sidebar', async ({
      page,
      context,
    }) => {
      await search(context, page, 'images');
      await searchQuerySubmitAndWait(imageWithContributor, page);
      await expect(thumbnail(page, 1)).toHaveAttribute(
        'title',
        'Open modal window'
      );
      await thumbnail(page, 1).click();

      await expect(page.getByTestId('image-modal')).toBeVisible();
      await expect(sidebar(page)).toHaveCount(0);
    });

    test('thumbnails say they open the image details, not a modal', async ({
      page,
      context,
    }) => {
      await searchImages(imageWithContributor, context, page);

      await expect(thumbnail(page, 1)).toHaveAttribute(
        'title',
        'Open image details'
      );
    });
  });

  test.describe('Sidebar content', () => {
    test('shows what the modal shows: title, contributor, licence, link to the viewer and visually similar images', async ({
      page,
      context,
    }) => {
      await searchImages(imageWithContributor, context, page);
      await openSidebar(1, page);

      const pane = sidebar(page);
      await expect(
        pane.getByRole('heading', { name: 'Dr. Darwin.' })
      ).toBeVisible();
      await expect(pane).toContainText('Fortey, W. S. (William Samuel)');
      await expect(pane).toContainText('Licence:');
      await expect(
        pane.getByRole('link', { name: 'View expanded image' })
      ).toBeVisible();
      await expect(
        pane.getByRole('heading', { name: 'Visually similar images' })
      ).toBeVisible();
    });

    test('clicking a different image while the sidebar is open updates it', async ({
      page,
      context,
    }) => {
      await searchImages('art of science', context, page);

      // Two images with different plain titles, so the heading shows which is open
      const titles = await plainThumbnailTitles(page);
      const first = titles.findIndex(Boolean);
      const other = titles.findIndex(title => title && title !== titles[first]);
      expect(
        first,
        'expected an image with a plain title'
      ).toBeGreaterThanOrEqual(0);
      expect(
        other,
        'expected two images with different titles'
      ).toBeGreaterThan(first);

      await openSidebar(first + 1, page);
      const heading = sidebar(page).getByRole('heading', { level: 2 });
      await expect(heading).toHaveText(titles[first]);

      await thumbnail(page, other + 1).click();

      // Still one open sidebar, now showing the other image
      await expect(sidebar(page)).toHaveCount(1);
      await expect(heading).toHaveText(titles[other]);
    });

    test('clicking a visually similar image selects it and records the click', async ({
      page,
      context,
    }) => {
      await searchImages(imageWithContributor, context, page);
      await openSidebar(1, page);
      const firstImage = new URL(page.url()).hash;

      await sidebar(page)
        .getByRole('heading', { name: 'Visually similar images' })
        .waitFor();
      await sidebar(page).getByRole('list').getByRole('button').first().click();

      await expect.poll(() => new URL(page.url()).hash).not.toBe(firstImage);

      // The page pushes this to the dataLayer itself, so it's there even with GTM blocked
      const events = await page.evaluate(
        () =>
          (window as unknown as { dataLayer: { event?: string }[] }).dataLayer
      );
      expect(events.some(e => e.event === 'visually_similar_image_click')).toBe(
        true
      );
    });
  });

  test.describe('Closing the sidebar', () => {
    test('the close button closes it and gives the grid its width back', async ({
      page,
      context,
    }) => {
      await searchImages(imageWithContributor, context, page);
      await openSidebar(1, page);
      const widthWithSidebar = (await resultsGrid(page).boundingBox())!.width;

      await sidebar(page)
        .getByRole('button', { name: 'Close image details' })
        .click();

      await expect(sidebar(page)).toHaveCount(0);
      await expect
        .poll(async () => (await resultsGrid(page).boundingBox())!.width)
        .toBeGreaterThan(widthWithSidebar);
    });

    test('Escape closes it', async ({ page, context }) => {
      await searchImages(imageWithContributor, context, page);
      await openSidebar(1, page);

      await page.keyboard.press('Escape');

      await expect(sidebar(page)).toHaveCount(0);
    });

    test('Escape in a filters dropdown only closes the dropdown, not the sidebar', async ({
      page,
      context,
    }) => {
      await searchImages(imageWithContributor, context, page);
      await openSidebar(1, page);

      const licences = page.getByRole('button', { name: 'Licences' });
      await openFilterDropdown('Licences', page);
      await expect(licences).toHaveAttribute('aria-expanded', 'true');

      await page.keyboard.press('Escape');

      await expect(licences).toHaveAttribute('aria-expanded', 'false');
      await expect(sidebar(page)).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('the sidebar can be opened and closed with the keyboard', async ({
      page,
      context,
    }) => {
      await searchImages(imageWithContributor, context, page);

      await thumbnail(page, 1).focus();
      await page.keyboard.press('Enter');
      await expect(sidebar(page)).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(sidebar(page)).toHaveCount(0);
    });

    test('focus moves into the sidebar when it opens and back to the thumbnail when it closes', async ({
      page,
      context,
    }) => {
      await searchImages('art of science', context, page);

      // In this search at the default viewport, thumbnails 5, 6, 9 and 10 change
      // row when the sidebar closes and the grid gets its width back, which
      // remounts them (1 to 4 don't). If the layout changes, this may need a
      // different number.
      await openSidebar(5, page);

      await expectFocusInside(sidebar(page));

      await page.keyboard.press('Escape');
      await expect(thumbnail(page, 5)).toBeFocused();
    });

    test('an image opened from the URL moves focus into the sidebar', async ({
      page,
      context,
    }) => {
      await searchImages(imageWithContributor, context, page);
      await openSidebar(1, page);

      // The image's id is now in the URL, so reloading opens it from there
      await page.reload();

      await expect(sidebar(page)).toBeVisible();
      await expect(
        sidebar(page).getByRole('button', { name: 'Close image details' })
      ).toBeFocused();
    });
  });
}); // Desktop

test.describe('Small screens', () => {
  const screen = { width: 390, height: 844 };
  const scrolledDown = 600;
  test.use({ viewport: screen });

  test('the sidebar fills the screen, keeps focus inside and closing it restores the scroll position of the grid', async ({
    page,
    context,
  }) => {
    await searchImages('art of science', context, page);
    await page.mouse.wheel(0, scrolledDown);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBe(scrolledDown);

    // Choose a thumbnail that's already in view, so opening it doesn't scroll
    const links = resultsGrid(page).getByRole('link');
    let visible;
    for (let i = 0; i < (await links.count()); i++) {
      const box = await links.nth(i).boundingBox();
      if (box && box.y > 0 && box.y + box.height < screen.height) {
        visible = links.nth(i);
        break;
      }
    }
    await visible!.click();

    const pane = await sidebar(page).boundingBox();
    // The whole screen, allowing a pixel of rounding
    expect(pane!.width).toBeGreaterThanOrEqual(screen.width - 1);
    expect(pane!.height).toBeGreaterThanOrEqual(screen.height - 1);

    // Tabbing can't leave it: go once round all of its tab stops and a step
    // past, forwards and then backwards
    await expect(
      sidebar(page).getByRole('heading', { level: 2 })
    ).toBeVisible();
    const tabStops = await sidebar(page).locator('a[href], button').count();
    for (const key of ['Tab', 'Shift+Tab']) {
      for (let i = 0; i <= tabStops; i++) {
        await page.keyboard.press(key);
        await expectFocusInside(sidebar(page));
      }
    }

    await sidebar(page)
      .getByRole('button', { name: 'Close image details' })
      .click();
    await expect(sidebar(page)).toHaveCount(0);
    // Scroll positions can be fractional, so allow for a pixel of rounding
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(Math.abs(scrollAfter - scrolledDown)).toBeLessThanOrEqual(1);
  });
});

test.describe('No regression', () => {
  test('thumbnails keep the analytics attributes GTM reads when an image is opened', async ({
    page,
    context,
  }) => {
    await searchImages(imageWithContributor, context, page);

    // With GTM blocked in these tests we can't see the event itself, only that
    // the thumbnail still carries what GTM needs to send it.
    await expect(thumbnail(page, 1)).toHaveAttribute(
      'data-gtm-trigger',
      'open_image_modal'
    );
    await expect(thumbnail(page, 1)).toHaveAttribute(
      'data-gtm-position-in-list',
      '1'
    );
  });
});
