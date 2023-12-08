import { test, expect } from '@playwright/test';
import { visualStory } from './helpers/contexts';

test('A visual story with a related document provides navigation between them both', async ({
  page,
  context,
}) => {
  // Go on visual story
  await visualStory('ZLe87hAAACIAwzqH', context, page);

  // Confirm breadcrumb structure is correct, second link being a relevant landing page
  const breadcrumbs = page.getByTestId('breadcrumbs');
  await expect(breadcrumbs.getByRole('link').locator('nth=1')).toHaveText(
    'Exhibitions'
  );

  // Use third breadcrumb link to go to related exhibition/event
  await breadcrumbs.getByRole('link').locator('nth=2').click();

  // Find "Visual Story" block and confirm the URL structure is correct
  const visualStoryBlock = page.getByRole('link', {
    name: 'Visual story Explore information to help you plan and prepare for your visit',
    exact: true,
  });
  await expect(visualStoryBlock).toBeVisible();
  await expect(visualStoryBlock).toHaveAttribute(
    'href',
    '/exhibitions/Wt4AACAAAFCxRfQM/visual-stories'
  );
});
