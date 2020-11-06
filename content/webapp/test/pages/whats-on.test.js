import { whatsOn } from '@weco/common/test/fixtures/pages/whats-on';
import WhatsOnPage from '../../pages/whats-on';
import { mountWithThemeAndContexts } from '@weco/common/test/fixtures/enzyme-helpers';

describe('/whats-on', () => {
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
