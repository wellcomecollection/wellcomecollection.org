import { expect } from '@playwright/test';
import { Page } from 'playwright';

// TODO aim to kill this whole file as part of https://github.com/wellcomecollection/wellcomecollection.org/issues/10409
// It shouldn't be used once that ticket is done.
//
const elementIsVisible = async (
  selector: string,
  page: Page
): Promise<boolean> => {
  return Boolean(await page.waitForSelector(selector));
};

export const expectItemIsVisible = async (
  selector: string,
  page: Page
): Promise<void> => {
  console.debug(`Waiting for '${selector}' to be visible'`);
  expect(await elementIsVisible(selector, page)).toBeTruthy();
};
