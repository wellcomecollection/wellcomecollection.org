import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { whatsOn } from '@weco/content/__mocks__/whats-on';
// We pull in the page after we've set the config
import WhatsOnPage from '@weco/content/pages/whats-on';

/**
 * with the upgrades to jest, this import needs to be mocked else
 * there'll be problems building the page.
 * this is the page that is tested outside of playwright
 */
jest.mock('uuid', () => ({
  v4: () => '1234',
}));

jest.mock('@weco/common/server-data');
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('next/router', () => require('next-router-mock'));

describe('/whats-on', () => {
  it('renders a featured exhibition when there is one', () => {
    const { getByText } = renderWithTheme(
      <WhatsOnPage
        {...whatsOn({
          hasExhibitions: true,
        })}
      />
    );
    expect(getByText('Being Human'));
  });

  it('renders no exhibitions when there are none', () => {
    const { getByText } = renderWithTheme(
      <WhatsOnPage
        {...whatsOn({
          hasExhibitions: false,
        })}
      />
    );
    expect(getByText('There are no current exhibitions'));
  });
});
