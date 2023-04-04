import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import Pagination from './Pagination';

// This approach to mocking useRouter() comes from a comment by Stephen Mason
// on GitHub: https://github.com/vercel/next.js/issues/7479#issuecomment-520048773
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

describe('Pagination', () => {
  it('omits the "Previous" button if we’re on page 1', () => {
    useRouter.mockImplementationOnce(() => ({ query: {} }));

    const { container } = renderWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );
    expect(container.innerHTML.includes('Previous')).toBe(false);
  });

  it('include the "Previous" button if we’re after page 1', () => {
    useRouter.mockImplementationOnce(() => ({ query: { page: '5' } }));

    const { container, getByRole } = renderWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );
    expect(container.innerHTML.includes('Previous')).toBe(true);
    expect(getByRole('button', { name: 'Previous (page 4)' })).toHaveAttribute(
      'href',
      '?page=4'
    );
  });

  it('omits the "Next" button if we’re on the last page', () => {
    useRouter.mockImplementationOnce(() => ({ query: { page: '10' } }));

    const { container } = renderWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );
    expect(container.innerHTML.includes('Next')).toBe(false);
  });

  it('includes the "Next" button if we’re not on the last page', () => {
    useRouter.mockImplementationOnce(() => ({ query: { page: '5' } }));

    const { container, getByRole } = renderWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );
    expect(container.innerHTML.includes('Next')).toBe(true);
    expect(getByRole('button', { name: 'Next (page 6)' })).toHaveAttribute(
      'href',
      '?page=6'
    );
  });

  it('includes the pathname and query parameters when linking to the next/previous pages', () => {
    useRouter.mockImplementationOnce(() => ({
      pathname: '/search/works',
      query: { page: '5', locations: 'available-online' },
    }));

    const { getByRole } = renderWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );
    expect(getByRole('button', { name: 'Previous (page 4)' })).toHaveAttribute(
      'href',
      '/search/works?page=4&locations=available-online'
    );
    expect(getByRole('button', { name: 'Next (page 6)' })).toHaveAttribute(
      'href',
      '/search/works?page=6&locations=available-online'
    );
  });

  it('includes the total number of pages', () => {
    useRouter.mockImplementationOnce(() => ({ query: { page: '5' } }));

    const { findByText } = renderWithTheme(
      <Pagination totalPages={10} ariaLabel="Results pagination" />
    );
    expect(findByText('Page 5 of 10'));
  });

  it('does pretty formatting of large page counts', () => {
    useRouter.mockImplementationOnce(() => ({ query: { page: '5' } }));

    const { findByText } = renderWithTheme(
      <Pagination totalPages={12345} ariaLabel="Results pagination" />
    );
    expect(findByText('Page 5 of 12,345'));
  });
});
