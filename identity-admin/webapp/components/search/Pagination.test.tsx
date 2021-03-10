import Pagination from './Pagination';
import React from 'react';
import { render } from '@testing-library/react';
import { buildSearchUrl } from '../../utils/search-util';

const renderComponent = (currentPage: number, pageCount: number) =>
  render(<Pagination currentPage={currentPage} pageCount={pageCount} />);
const getFirstLink = (container: HTMLElement) =>
  container.querySelector(
    '.user-pagination__item.user-pagination__item--first'
  );
const getLastLink = (container: HTMLElement) =>
  container.querySelector('.user-pagination__item.user-pagination__item--last');
const getAllLinks = (container: HTMLElement) =>
  container.getElementsByClassName('user-pagination__item');
const expectedLinkUrl = (expectedPage: string) =>
  buildSearchUrl(expectedPage, 'active', 'Bob', 'bob@email.com', 'email', '1');

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
  it('disables previous link on first page', async () => {
    const { container } = renderComponent(1, 3);
    const previous = getFirstLink(container);
    expect(previous).toHaveClass('user-pagination__item--disabled');
    expect(previous).not.toHaveAttribute('href');
  });

  it('disables next link on last page', async () => {
    const { container } = renderComponent(3, 3);
    const next = getLastLink(container);
    expect(next).toHaveClass('user-pagination__item--disabled');
    expect(next).not.toHaveAttribute('href');
  });

  it('shows one numbered previous page link on second page', async () => {
    const { container } = renderComponent(2, 3);
    const previous = getAllLinks(container).item(1);
    expect(previous).not.toHaveClass('user-pagination__item--disabled');
    expect(previous).toHaveAttribute('href', expectedLinkUrl('1'));
  });

  it('shows two numbered previous page links on third page', async () => {
    const { container } = renderComponent(3, 3);
    const nMinus1 = getAllLinks(container).item(1);
    const nMinus2 = getAllLinks(container).item(2);
    expect(nMinus1).not.toHaveClass('user-pagination__item--disabled');
    expect(nMinus1).toHaveAttribute('href', expectedLinkUrl('1'));
    expect(nMinus2).not.toHaveClass('user-pagination__item--disabled');
    expect(nMinus2).toHaveAttribute('href', expectedLinkUrl('2'));
  });

  it('shows numbered link to first page on fourth page', async () => {
    const { container } = renderComponent(4, 4);
    const first = getAllLinks(container).item(1);
    expect(first).not.toHaveClass('user-pagination__item--disabled');
    expect(first).toHaveAttribute('href', expectedLinkUrl('1'));
  });

  it('shows ellipses between first page link and link n-2 on fifth page', async () => {
    const { container } = renderComponent(5, 5);
    const prefixEllipses = getAllLinks(container).item(2);
    expect(prefixEllipses).not.toHaveAttribute('href');
    expect(prefixEllipses).toHaveTextContent('...');
  });

  it('shows one numbered next page link on page T-1', async () => {
    const { container } = renderComponent(4, 5);
    const allLinks = getAllLinks(container);
    const next = allLinks.item(allLinks.length - 2);
    expect(next).not.toHaveClass('user-pagination__item--disabled');
    expect(next).toHaveAttribute('href', expectedLinkUrl('5'));
  });

  it('shows two numbered next page links on page T-2', async () => {
    const { container } = renderComponent(3, 5);
    const allLinks = getAllLinks(container);
    const nPlus1 = allLinks.item(allLinks.length - 3);
    const nPlus2 = allLinks.item(allLinks.length - 2);
    expect(nPlus1).not.toHaveClass('user-pagination__item--disabled');
    expect(nPlus1).toHaveAttribute('href', expectedLinkUrl('4'));
    expect(nPlus2).not.toHaveClass('user-pagination__item--disabled');
    expect(nPlus2).toHaveAttribute('href', expectedLinkUrl('5'));
  });

  it('shows last page link on page T-3', async () => {
    const { container } = renderComponent(2, 5);
    const allLinks = getAllLinks(container);
    const last = allLinks.item(allLinks.length - 2);
    expect(last).not.toHaveClass('user-pagination__item--disabled');
    expect(last).toHaveAttribute('href', expectedLinkUrl('5'));
  });

  it('shows ellipses between last page link and link n+2 on page T-4', async () => {
    const { container } = renderComponent(1, 5);
    const allLinks = getAllLinks(container);
    const postfixEllipses = allLinks.item(allLinks.length - 3);
    expect(postfixEllipses).not.toHaveAttribute('href');
    expect(postfixEllipses).toHaveTextContent('...');
  });
});
