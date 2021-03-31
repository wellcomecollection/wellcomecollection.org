import { fireEvent, render, screen } from '@testing-library/react';
import StatusDropdown from './StatusDropdown';

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

const renderComponent = () => render(<StatusDropdown />);
const getOptions = () => screen.getAllByRole('link');
const clickToggle = () => fireEvent.click(screen.getByRole('dropdown'));
const getLabelArrow = () => screen.getAllByRole('label')[1];
const expectedUrl = (statusValue: string) =>
  '/?email=bob%40email.com&name=Bob&page=1&status=' + statusValue;

describe('Status dropdown', () => {
  it('is initially collapsed', () => {
    renderComponent();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(getLabelArrow()).toHaveTextContent('▾');
  });

  it('expands on initial click', () => {
    renderComponent();
    clickToggle();
    const options = getOptions();
    expect(options.length).toBe(4);
    expect(options[0]).toHaveTextContent('Any');
    expect(options[0]).toHaveAttribute('href', expectedUrl('any'));
    expect(options[1]).toHaveTextContent('Active');
    expect(options[1]).toHaveAttribute('href', expectedUrl('active'));
    expect(options[2]).toHaveTextContent('Blocked');
    expect(options[2]).toHaveAttribute('href', expectedUrl('locked'));
    expect(options[3]).toHaveTextContent('Pending delete');
    expect(options[3]).toHaveAttribute('href', expectedUrl('deletePending'));
    expect(getLabelArrow()).toHaveTextContent('▴');
  });

  it('collapses on second click', () => {
    renderComponent();
    clickToggle();
    clickToggle();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(getLabelArrow()).toHaveTextContent('▾');
  });
});
