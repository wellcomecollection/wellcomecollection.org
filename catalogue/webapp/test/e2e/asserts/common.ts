import { itemsIsVisible, elementIsVisible } from '../actions/common';

export async function expectItemsIsVisible(
  selector: string,
  miniumNumber: number
): Promise<void> {
  expect(await itemsIsVisible(selector, miniumNumber)).toBeTruthy();
}

export async function expectItemIsVisible(selector: string): Promise<void> {
  expect(await elementIsVisible(selector)).toBeTruthy();
}

export function expectUrlIsOnPage(regex: RegExp): void {
  const condition = RegExp(regex);
  expect(condition.test(page.url())).toBeTruthy();
}
