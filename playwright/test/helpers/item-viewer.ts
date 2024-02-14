import { Page } from 'playwright';
import { expect } from '@playwright/test';
import { isMobile } from './contexts';

export const getShowContentBtnAndFirstImageStatus = async (
  page: Page,
  {
    showContent,
    firstImage,
  }: { showContent: 'hidden' | 'visible'; firstImage?: 'hidden' | 'visible' }
): Promise<void> => {
  const showContentButton = page.getByRole('button', {
    name: 'Show the content',
  });
  const firstImageLocator = page.getByTestId('image-0');

  if (showContent === 'hidden') {
    await expect(showContentButton).toBeHidden();
  } else {
    await expect(showContentButton).toBeVisible();
  }

  if (firstImage && firstImage === 'hidden') {
    await expect(firstImageLocator).toBeHidden();
  } else if (firstImage) {
    await expect(firstImageLocator).toBeVisible();
  }
};

export const accessSidebar = async (page: Page) => {
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Show info' }).click();
  }
};
