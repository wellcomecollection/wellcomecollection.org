import Sorter from './Sorter';
import { SortField } from '../../interfaces';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

const mockedRouter = useRouter as jest.Mock;

jest.mock('next/router');

const renderComponent = (sort: SortField) => {
  return render(<Sorter fieldName={sort} />);
};

const mockQueryParams = (params: { sortDir?: string; sort: SortField }) => {
  mockedRouter.mockImplementation(() => {
    return {
      query: {
        status: 'active',
        name: 'Bob',
        email: 'bob@email.com',
        ...params,
      },
    };
  });
};

const expectedUrl = (sort: SortField, sortDir: string) =>
  '/?email=bob%40email.com&name=Bob&page=1&sort=' +
  sort +
  '&sortDir=' +
  sortDir +
  '&status=active';

describe('Sorter', () => {
  it('shows down arrow if sort is applied to a different field', async () => {
    mockQueryParams({ sortDir: '1', sort: SortField.Email });
    renderComponent(SortField.Name);
    expect(screen.getByText('▾')).toHaveAttribute(
      'href',
      expectedUrl(SortField.Name, '1')
    );
  });

  it('shows down arrow if sort direction is asc', async () => {
    mockQueryParams({ sortDir: '1', sort: SortField.Name });
    renderComponent(SortField.Name);
    expect(screen.getByText('▾')).toHaveAttribute(
      'href',
      expectedUrl(SortField.Name, '-1')
    );
  });

  it('shows up arrow if sort dir is desc', async () => {
    mockQueryParams({ sortDir: '-1', sort: SortField.Name });
    renderComponent(SortField.Name);
    expect(screen.getByText('▴')).toHaveAttribute(
      'href',
      expectedUrl(SortField.Name, '1')
    );
  });
});
