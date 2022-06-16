import { expect } from '@playwright/test';
import { Page } from 'playwright';
import { itemsIsVisible, elementIsVisible } from '../actions/common';

export const expectItemsIsVisible = async (
  selector: string,
  minimumNumber: number,
  page: Page
): Promise<void> => {
  expect(await itemsIsVisible(selector, minimumNumber, page)).toBeTruthy();
};

export const expectItemIsVisible = async (
  selector: string,
  page: Page
): Promise<void> => {
  console.debug(`Waiting for '${selector}' to be visible'`);
  expect(await elementIsVisible(selector, page)).toBeTruthy();
};

export const expectUrlToMatch = (regex: RegExp | string, page: Page): void => {
  const condition = RegExp(regex);
  expect(condition.test(page.url())).toBeTruthy();
};
