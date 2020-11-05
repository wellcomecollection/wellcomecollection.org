import { parsePage } from '../../../services/prismic/pages';
import { pageWithoutBody } from '../../fixtures/pages/page';
import { whatsOn } from '../../fixtures/pages/whats-on';
import WhatsOnPage from '../../../../content/webapp/pages/whats-on';
import { mountWithThemeAndContexts } from '../../../../common/test/fixtures/enzyme-helpers';

describe('pages', () => {
  describe('whats-on', () => {
    it('renders different markup with/without a featured exhibition', () => {
      const pageWithExhibition = mountWithThemeAndContexts(
        <WhatsOnPage {...whatsOn(true)} />
      );
      const pageWithoutExhibition = mountWithThemeAndContexts(
        <WhatsOnPage {...whatsOn(false)} />
      );
      expect(
        pageWithExhibition.exists('[data-test-id="featured-exhibition"]')
      ).toBe(true);
      expect(pageWithExhibition.exists('[data-test-id="no-exhibitions"]')).toBe(
        false
      );
      expect(
        pageWithoutExhibition.exists('[data-test-id="no-exhibitions"]')
      ).toBe(true);
      expect(
        pageWithoutExhibition.exists('[data-test-id="featured-exhibition"]')
      ).toBe(false);
    });
  });
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
