import { fireEvent, screen } from '@testing-library/react';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import PrevNextLink from '.';

describe('PrevNextLink', () => {
  it('renders a link named by its label', () => {
    renderWithTheme(
      <PrevNextLink
        direction="next"
        label="Next page"
        link={{ href: { pathname: '/works/abc/items' } }}
      />
    );

    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute(
      'href',
      '/works/abc/items'
    );
  });

  it('renders a non-link when there is nowhere to go', () => {
    renderWithTheme(
      <PrevNextLink direction="previous" label="Previous stop" />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Previous stop unavailable')).toBeInTheDocument();
  });

  it('renders a button when given a click handler', () => {
    const onClick = jest.fn();
    renderWithTheme(
      <PrevNextLink direction="next" label="Next" onClick={onClick} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('disables the button without adding "unavailable"', () => {
    renderWithTheme(
      <PrevNextLink
        direction="previous"
        label="Previous"
        onClick={jest.fn()}
        disabled
      />
    );

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });
});
