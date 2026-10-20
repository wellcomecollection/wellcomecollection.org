import { BrowserContext, Page } from '@playwright/test';

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

// A thumbnail's alt text is its title. Empty if the title has display markup
// in it (<i>, <sup>), as the sidebar shows that formatted, not as the alt text.
const plainThumbnailTitle = async (page: Page, nthChild: number) => {
  const alt =
    (await thumbnail(page, nthChild).getByRole('img').getAttribute('alt')) ??
    '';
  return alt.includes('<') ? '' : alt.replace(/\s+/g, ' ').trim();
};

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
// search-images.test.ts
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

      // Beside the grid, not on top of it
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
      const count = await resultsGrid(page).getByRole('link').count();
      const titles = await Promise.all(
        Array.from({ length: Math.min(count, 6) }, (_, i) =>
          plainThumbnailTitle(page, i + 1)
        )
      );
      const first = titles.findIndex(t => t);
      const other = titles.findIndex(t => t && t !== titles[first]);
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
      await searchImages(imageWithContributor, context, page);
      await openSidebar(1, page);

      await expect(sidebar(page).locator(':focus')).toHaveCount(1);

      await page.keyboard.press('Escape');
      await expect(thumbnail(page, 1)).toBeFocused();
    });
  });
}); // Desktop

test.describe('Small screens', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the sidebar fills the screen and closing it restores the scroll position of the grid', async ({
    page,
    context,
  }) => {
    await searchImages('art of science', context, page);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(600);

    // Choose a thumbnail that's already in view, so opening it doesn't scroll
    const viewportHeight = page.viewportSize()!.height;
    const links = resultsGrid(page).getByRole('link');
    let visible;
    for (let i = 0; i < (await links.count()); i++) {
      const box = await links.nth(i).boundingBox();
      if (box && box.y > 0 && box.y + box.height < viewportHeight) {
        visible = links.nth(i);
        break;
      }
    }
    await visible!.click();

    const pane = await sidebar(page).boundingBox();
    expect(pane!.width).toBeGreaterThanOrEqual(389);
    expect(pane!.height).toBeGreaterThanOrEqual(viewportHeight - 1);

    await sidebar(page)
      .getByRole('button', { name: 'Close image details' })
      .click();
    await expect(sidebar(page)).toHaveCount(0);
    // Scroll positions can be fractional, so allow for a pixel of rounding
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(Math.abs(scrollAfter - 600)).toBeLessThanOrEqual(1);
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
