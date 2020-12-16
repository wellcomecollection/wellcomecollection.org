export async function fillInputAction(
  selector: string,
  text: string
): Promise<voselector> {
  await page.fill(selector, text);
}

export async function pressEnterAction(selector: string): Promise<void> {
  await page.press(selector, 'Enter');
}

export async function getInputValueAction(selector: string): Promise<string> {
  const value = await page.$eval<string, HTMLInputElement>(
    selector,
    el => el.value
  );
  return value;
}

export function isMobile(): boolean {
  return Boolean(deviceName);
}

export async function elementIsVisible(selector: string): Promise<boolean> {
  return Boolean(await page.waitForSelector(selector));
}

export async function itemsIsVisible(
  selector: string,
  minNoOfItems: number
): Promise<boolean> {
  const result = await page.$$eval(
    selector,
    (items, min) => {
      return items.length >= min;
    },
    minNoOfItems
  );

  return result;
}
