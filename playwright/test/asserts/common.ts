import { expect } from '@playwright/test';
import { Page } from 'playwright';
import { itemsIsVisible, elementIsVisible } from '../actions/common';

export const expectItemsIsVisible =
  (selector: string, miniumNumber: number) =>
  async (page: Page): Promise<void> => {
    expect(await itemsIsVisible(selector, miniumNumber)(page)).toBeTruthy();
  };

export const expectItemIsVisible =
  (selector: string) =>
  async (page: Page): Promise<void> => {
    console.debug(`Waiting for '${selector}' to be visible'`);
    expect(await elementIsVisible(selector)(page)).toBeTruthy();
  };

export const expectUrlToMatch =
  (regex: RegExp | string) =>
  (page: Page): void => {
    const condition = RegExp(regex);
    expect(condition.test(page.url())).toBeTruthy();
  };
