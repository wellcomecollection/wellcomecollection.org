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
  });
});
