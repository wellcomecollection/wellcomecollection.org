import { whatsOn } from '../../__mocks__/whats-on';
import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';

// We pull in the page after we've set the config
import WhatsOnPage from '../../pages/whats-on';

/**
 * with the upgrades to jest, this import needs to be mocked else
 * there'll be problems building the page.
 * this is the page that is tested outside of playwright
 */
jest.mock('uuid', () => ({
  v4: () => '1234',
}));
jest.mock('@weco/common/server-data');
jest.mock('next/router', () => require('next-router-mock'));

const featuredExhibitionSelector = '[data-test-id="featured-exhibition"]';
const noExhibitionsSelector = '[data-test-id="no-exhibitions"]';

describe('/whats-on', () => {
  it('renders a featured exhibition when there is one', () => {
    const pageWithExhibition = mountWithTheme(
      <WhatsOnPage {...whatsOn(true)} />
    );
    expect(pageWithExhibition.exists(featuredExhibitionSelector)).toBe(true);
    expect(pageWithExhibition.exists(noExhibitionsSelector)).toBe(false);
  });

  it('renders no exhibitions when there are none', () => {
    const pageWithoutExhibition = mountWithTheme(
      <WhatsOnPage {...whatsOn(false)} />
    );
    expect(pageWithoutExhibition.exists(featuredExhibitionSelector)).toBe(
      false
    );
    expect(pageWithoutExhibition.exists(noExhibitionsSelector)).toBe(true);
  });
});
