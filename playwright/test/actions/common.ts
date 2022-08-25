import { Page } from 'playwright';

export const fillInputAction = async (
  selector: string,
  text: string,
  page: Page
): Promise<void> => {
  await page.fill(selector, text);
};

export const elementIsVisible = async (
  selector: string,
  page: Page
): Promise<boolean> => {
  return Boolean(await page.waitForSelector(selector));
};

export const itemsIsVisible = async (
  selector: string,
  minNoOfItems: number,
  page: Page
): Promise<boolean> => {
  const result = await page.$$eval(
    selector,
    (items, min) => {
      return items.length >= min;
    },
    minNoOfItems
  );

  return result;
};
