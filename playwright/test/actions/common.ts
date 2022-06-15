import { Page } from 'playwright';

export const fillInputAction =
  (selector: string, text: string) =>
  async (page: Page): Promise<void> => {
    await page.fill(selector, text);
  };

export const elementIsVisible =
  (selector: string) =>
  async (page: Page): Promise<boolean> => {
    return Boolean(await page.waitForSelector(selector));
  };

export const itemsIsVisible =
  (selector: string, minNoOfItems: number) =>
  async (page: Page): Promise<boolean> => {
    const result = await page.$$eval(
      selector,
      (items, min) => {
        return items.length >= min;
      },
      minNoOfItems
    );

    return result;
  };
