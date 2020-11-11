import { whatsOn } from '@weco/common/test/fixtures/pages/whats-on';
import WhatsOnPage from '../../pages/whats-on';
import { mountWithThemeAndContexts } from '@weco/common/test/fixtures/enzyme-helpers';

const featuredExhibitionSelector = '[data-test-id="featured-exhibition"]';
const noExhibitionsSelector = '[data-test-id="no-exhibitions"]';

describe('/whats-on', () => {
  it('renders a featured exhibition when there is one', () => {
    const pageWithExhibition = mountWithThemeAndContexts(
      <WhatsOnPage {...whatsOn(true)} />
    );
    expect(pageWithExhibition.exists(featuredExhibitionSelector)).toBe(true);
    expect(pageWithExhibition.exists(noExhibitionsSelector)).toBe(false);
  });

  it('renders no exhibitions when there are none', () => {
    const pageWithoutExhibition = mountWithThemeAndContexts(
      <WhatsOnPage {...whatsOn(false)} />
    );
    expect(pageWithoutExhibition.exists(featuredExhibitionSelector)).toBe(
      false
    );
    expect(pageWithoutExhibition.exists(noExhibitionsSelector)).toBe(true);
  });
});
