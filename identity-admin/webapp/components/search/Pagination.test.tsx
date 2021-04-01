import Pagination from './Pagination';
import React from 'react';
import { render, screen } from '@testing-library/react';

const renderComponent = (currentPage: number, pageCount: number) =>
  render(<Pagination currentPage={currentPage} pageCount={pageCount} />);
const getAllLinks = () => screen.getAllByRole('link');
const expectedLinkUrl = (expectedPage: string) =>
  '/?email=bob%40email.com&name=Bob&page=' +
  expectedPage +
  '&sort=email&sortDir=1&status=active';

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

describe('Pagination', () => {
  it('disables previous link on first page', () => {
    renderComponent(1, 3);
    const previous = screen.getByText('Previous');
    expect(previous).toHaveClass('user-pagination__item--disabled');
    expect(previous).not.toHaveAttribute('href');
  });

  it('disables next link on last page', () => {
    renderComponent(3, 3);
    const next = screen.getByText('Next');
    expect(next).toHaveClass('user-pagination__item--disabled');
    expect(next).not.toHaveAttribute('href');
  });

  it('shows one numbered previous page link on second page', () => {
    renderComponent(2, 3);
    const previous = getAllLinks()[1];
    expect(previous).not.toHaveClass('user-pagination__item--disabled');
    expect(previous).toHaveAttribute('href', expectedLinkUrl('1'));
  });

  it('shows two numbered previous page links on third page', () => {
    renderComponent(3, 3);
    const nMinus1 = getAllLinks()[1];
    const nMinus2 = getAllLinks()[2];
    expect(nMinus1).not.toHaveClass('user-pagination__item--disabled');
    expect(nMinus1).toHaveAttribute('href', expectedLinkUrl('1'));
    expect(nMinus2).not.toHaveClass('user-pagination__item--disabled');
    expect(nMinus2).toHaveAttribute('href', expectedLinkUrl('2'));
  });

  it('shows numbered link to first page on fourth page', () => {
    renderComponent(4, 4);
    const first = getAllLinks()[1];
    expect(first).not.toHaveClass('user-pagination__item--disabled');
    expect(first).toHaveAttribute('href', expectedLinkUrl('1'));
  });

  it('shows ellipses between first page link and link n-2 on fifth page', () => {
    renderComponent(5, 10);
    const prefixEllipses = screen.getAllByText('...')[0];
    expect(prefixEllipses).not.toHaveAttribute('href');
    expect(prefixEllipses).toHaveTextContent('...');
    expect(prefixEllipses).toHaveClass(
      'user-pagination__item--prefix-ellipses'
    );
  });

  it('shows one numbered next page link on page T-1', () => {
    renderComponent(4, 5);
    const allLinks = getAllLinks();
    const next = allLinks[allLinks.length - 2];
    expect(next).not.toHaveClass('user-pagination__item--disabled');
    expect(next).toHaveAttribute('href', expectedLinkUrl('5'));
  });

  it('shows two numbered next page links on page T-2', () => {
    renderComponent(3, 5);
    const allLinks = getAllLinks();
    const nPlus1 = allLinks[allLinks.length - 3];
    const nPlus2 = allLinks[allLinks.length - 2];
    expect(nPlus1).not.toHaveClass('user-pagination__item--disabled');
    expect(nPlus1).toHaveAttribute('href', expectedLinkUrl('4'));
    expect(nPlus2).not.toHaveClass('user-pagination__item--disabled');
    expect(nPlus2).toHaveAttribute('href', expectedLinkUrl('5'));
  });

  it('shows last page link on page T-3', () => {
    renderComponent(2, 5);
    const allLinks = getAllLinks();
    const last = allLinks[allLinks.length - 2];
    expect(last).not.toHaveClass('user-pagination__item--disabled');
    expect(last).toHaveAttribute('href', expectedLinkUrl('5'));
  });

  it('shows ellipses between last page link and link n+2 on page T-4', () => {
    renderComponent(5, 10);
    const postfixEllipses = screen.getAllByText('...')[1];
    expect(postfixEllipses).not.toHaveAttribute('href');
    expect(postfixEllipses).toHaveTextContent('...');
    expect(postfixEllipses).toHaveClass(
      'user-pagination__item--suffix-ellipses'
    );
  });
});
