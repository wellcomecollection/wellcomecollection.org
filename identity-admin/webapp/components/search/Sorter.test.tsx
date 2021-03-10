import Sorter from './Sorter';
import { SortField } from '../../interfaces';
import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { buildSearchUrl } from '../../utils/search-util';

const mockedRouter = useRouter as jest.Mock;

jest.mock('next/router');

const renderComponent = (sort: SortField) => {
  return render(<Sorter fieldName={sort} />);
};

const mockQueryParams = (sortDir: string | undefined, sort: SortField) => {
  mockedRouter.mockImplementation(() => {
    return {
      query: {
        status: 'active',
        name: 'Bob',
        email: 'bob@email.com',
        sort: sort,
        sortDir: sortDir,
      },
    };
  });
};

const expectedUrl = (sort: SortField, sortDir: string) =>
  buildSearchUrl('1', 'active', 'Bob', 'bob@email.com', sort, sortDir);

describe('Sorter', () => {
  it('shows down arrow if sort is applied to a different field', async () => {
    mockQueryParams('1', SortField.Email);
    const { container } = renderComponent(SortField.Name);
    expect(container).toHaveTextContent('▾');
    expect(container.firstChild).toHaveAttribute(
      'href',
      expectedUrl(SortField.Name, '1')
    );
  });

  it('shows down arrow if sort direction is asc', async () => {
    mockQueryParams('1', SortField.Name);
    const { container } = renderComponent(SortField.Name);
    expect(container).toHaveTextContent('▾');
    expect(container.firstChild).toHaveAttribute(
      'href',
      expectedUrl(SortField.Name, '-1')
    );
  });

  it('shows up arrow if sort dir is desc', async () => {
    mockQueryParams('-1', SortField.Name);
    const { container } = renderComponent(SortField.Name);
    expect(container).toHaveTextContent('▴');
    expect(container.firstChild).toHaveAttribute(
      'href',
      expectedUrl(SortField.Name, '1')
    );
  });
});
