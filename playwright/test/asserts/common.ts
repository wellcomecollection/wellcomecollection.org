import { expect } from '@playwright/test';
import { Page } from 'playwright';

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
