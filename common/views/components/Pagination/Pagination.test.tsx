import { mountWithTheme } from '../../../test/fixtures/enzyme-helpers';
import Pagination from './Pagination';

// This approach to mocking useRouter() comes from a comment by Stephen Mason
// on GitHub: https://github.com/vercel/next.js/issues/7479#issuecomment-520048773
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

describe('Pagination', () => {
  it('omits the "Previous" button if we’re on page 1', () => {
    useRouter.mockImplementationOnce(() => ({ query: {} }));

    const component = mountWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );

    expect(component.html().includes('Previous')).toBe(false);
  });

  it('include the "Previous" button if we’re after page 1', () => {
    useRouter.mockImplementationOnce(() => ({ query: { page: '5' } }));

    const component = mountWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );

    expect(component.html().includes('Previous')).toBe(true);
    expect(component.html().includes('href="?page=4"')).toBe(true);
  });

  it('omits the "Next" button if we’re on the last page', () => {
    useRouter.mockImplementationOnce(() => ({ query: { page: '10' } }));

    const component = mountWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );

    expect(component.html().includes('Next')).toBe(false);
  });

  it('includes the "Next" button if we’re not on the last page', () => {
    useRouter.mockImplementationOnce(() => ({ query: { page: '5' } }));

    const component = mountWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );

    expect(component.html().includes('Next')).toBe(true);
    expect(component.html().includes('href="?page=6"')).toBe(true);
  });

  it('includes the pathname and query parameters when linking to the next/previous pages', () => {
    useRouter.mockImplementationOnce(() => ({
      pathname: '/search/works',
      query: { page: '5', locations: 'available-online' },
    }));

    const component = mountWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );

    expect(
      component
        .html()
        .includes('href="/search/works?page=6&amp;locations=available-online"')
    ).toBe(true);
    expect(
      component
        .html()
        .includes('href="/search/works?page=4&amp;locations=available-online"')
    ).toBe(true);
  });

  it('includes the total number of pages', () => {
    useRouter.mockImplementationOnce(() => ({ query: { page: '5' } }));

    const component = mountWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );

    expect(component.text().includes('Page 5 of 10')).toBe(true);
  });

  it('does pretty formatting of large page counts', () => {
    useRouter.mockImplementationOnce(() => ({ query: { page: '5' } }));

    const component = mountWithTheme(
      <Pagination totalPages={12345} ariaLabel="Results pagination" />
    );

    expect(component.text().includes('Page 5 of 12,345')).toBe(true);
  });
});
