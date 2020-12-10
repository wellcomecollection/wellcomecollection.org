import { elementIsVisible } from '../selectors/common';
import { workTitleHeading } from '../selectors/work';
export function expectUrlIsOnWorkPage(): void {
  expect(page.url()).toMatch(/\/works\/[a-zA-Z0-9]+/);
}

export async function expectWorkDetailsIsVisible(): Promise<void> {
  expect(await elementIsVisible(workTitleHeading)).toBeTruthy();
}
