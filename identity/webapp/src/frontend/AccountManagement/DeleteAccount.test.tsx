import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../test-utils';
import { DeleteAccount } from './DeleteAccount';

const renderComponent = () => render(<DeleteAccount />);

describe('DeleteAccount', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /delete account/i })).toBeInTheDocument();
  });

  it('lets the user enter their password', () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();

    userEvent.type(passwordInput, 'dolphins');
    expect(passwordInput).toHaveValue('dolphins');
  });
});
