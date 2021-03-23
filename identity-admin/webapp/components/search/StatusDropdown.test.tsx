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

const renderComponent = () => render(<StatusDropdown />);
const getOptions = (container: HTMLElement) =>
  container.getElementsByClassName('status-dropdown__option');
const clickToggle = (container: HTMLElement) => {
  const label = container.querySelector('.status-dropdown__label');
  if (label) {
    fireEvent.click(label);
  } else {
    fail('Unable to find label');
  }
};
const getLabelArrow = (container: HTMLElement) =>
  container.getElementsByClassName('status-dropdown__label-arrow');
const expectedUrl = (statusValue: string) =>
  buildSearchUrl('1', statusValue, 'Bob', 'bob@email.com');

describe('Status dropdown', () => {
  it('is initially collapsed', () => {
    const { container } = renderComponent();
    const options = getOptions(container);
    expect(options.length).toBe(0);
    const labelArrow = getLabelArrow(container)[0];
    expect(labelArrow).toHaveTextContent('▾');
  });

  it('expands on initial click', () => {
    const { container } = renderComponent();
    clickToggle(container);
    const options = getOptions(container);
    expect(options.length).toBe(4);
    expect(options[0]).toHaveTextContent('Any');
    expect(options[0]).toHaveAttribute('href', expectedUrl('any'));
    expect(options[1]).toHaveTextContent('Active');
    expect(options[1]).toHaveAttribute('href', expectedUrl('active'));
    expect(options[2]).toHaveTextContent('Blocked');
    expect(options[2]).toHaveAttribute('href', expectedUrl('locked'));
    expect(options[3]).toHaveTextContent('Pending delete');
    expect(options[3]).toHaveAttribute('href', expectedUrl('deletePending'));
    const labelArrow = getLabelArrow(container)[0];
    expect(labelArrow).toHaveTextContent('▴');
  });

  it('collapses on second click', () => {
    const { container } = renderComponent();
    clickToggle(container);
    clickToggle(container);
    const options = getOptions(container);
    expect(options.length).toBe(0);
    const labelArrow = getLabelArrow(container)[0];
    expect(labelArrow).toHaveTextContent('▾');
  });
});
