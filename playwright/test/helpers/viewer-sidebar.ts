import { Page } from 'playwright';

import { isMobile } from './contexts';

// On mobile the item viewer's sidebar (Contents, Details, downloads, etc.)
// is hidden behind a 'Show info' button rather than shown directly.
export const accessSidebarOnMobile = async (page: Page): Promise<void> => {
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Show info' }).click();
  }
};
