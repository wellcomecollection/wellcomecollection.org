import React from 'react';
import { render, screen } from '../test-utils';
import { DeleteAccount } from './DeleteAccount';

const renderComponent = () => render(<DeleteAccount />);

describe('DeleteAccount', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /delete account/i })).toBeInTheDocument();
  });
});
