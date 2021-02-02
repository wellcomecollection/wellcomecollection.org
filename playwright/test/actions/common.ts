export async function fillInputAction(
  selector: string,
  text: string
): Promise<void> {
  await page.fill(selector, text);
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

export async function findTextOnPage(regex: RegExp | string): Promise<boolean> {
  const pageContent = await page.content();
  const regexMatch = new RegExp(regex);
  return regexMatch.test(pageContent);
}
