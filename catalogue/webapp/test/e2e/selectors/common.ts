export async function fillInput(id: string, text: string): Promise<void> {
  await page.fill(id, text);
}

export async function pressEnter(id: string): Promise<void> {
  await page.press(id, 'Enter');
}

export async function getInputValue(id: string): Promise<string> {
  const value = await page.$eval<string, HTMLInputElement>(id, el => el.value);
  return value;
}

export function isMobile(): boolean {
  return Boolean(deviceName);
}

export async function elementIsVisible(id: string): Promise<boolean> {
  const result = await page.$eval<boolean, HTMLDivElement>(id, () => true);
  return result;
}

export async function itemsIsVisible(
  id: string,
  minNoOfItems: number
): Promise<boolean> {
  const result = await page.$$eval(
    id,
    (items, min) => {
      return items.length >= min;
    },
    minNoOfItems
  );

  return result;
}
