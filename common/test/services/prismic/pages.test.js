import { parsePage } from '../../../services/prismic/pages';
import { pageWithoutBody } from '../../fixtures/pages/page';

describe('pages', () => {
  describe('parsePage', () => {
    describe('parseOnThisPage', () => {
      it(`Object onThisPage should return [] if body does not exist`, () => {
        const page = parsePage(pageWithoutBody);
        expect(Array.isArray(page.onThisPage)).toBeTruthy();
        expect(page.onThisPage.length).toBe(0);
      });
    });
  });
});
