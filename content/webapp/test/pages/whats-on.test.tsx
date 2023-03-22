import { whatsOn } from '../../__mocks__/whats-on';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

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

describe('/whats-on', () => {
  it('renders a featured exhibition when there is one', () => {
    const { container, getByText } = renderWithTheme(
      <WhatsOnPage {...whatsOn(true)} />
    );
    expect(getByText('Being Human'));
  });

  it('renders no exhibitions when there are none', () => {
    const { container, getByText } = renderWithTheme(
      <WhatsOnPage {...whatsOn(false)} />
    );
    console.log(container.outerHTML);
    expect(getByText('There are no current exhibitions'));
  });
});
