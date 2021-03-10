import { fireEvent, render } from '@testing-library/react';
import StatusDropdown from './StatusDropdown';
import { buildSearchUrl } from '../../utils/search-util';

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: {
        status: 'active',
        name: 'Bob',
        email: 'bob@email.com',
        sort: 'email',
        sortDir: '1',
      },
    };
  },
}));

describe('Status dropdown', () => {
  const { location } = window;

  beforeAll((): void => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      href: '',
    };
  });

  afterAll((): void => {
    window.location = location;
  });

  it('redirects to search with status filter', async () => {
    const { container } = render(<StatusDropdown />);
    const select = container.firstChild;
    if (select) {
      expect(select).toHaveValue('active');
      fireEvent.change(select, {
        target: { value: 'locked' },
      });
      expect(window.location.href).toBe(
        buildSearchUrl('1', 'locked', 'Bob', 'bob@email.com')
      );
    } else {
      fail('Select element was not rendered');
    }
  });
});
