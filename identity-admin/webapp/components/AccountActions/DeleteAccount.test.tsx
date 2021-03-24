import React from 'react';
import { render, screen } from '@testing-library/react';
import { DeleteAccount } from './DeleteAccount';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: { userId: '3141592' },
    };
  },
}));

const renderComponent = () => render(<DeleteAccount />);

describe('DeleteAccount', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByRole('listitem')).toHaveTextContent(/delete account/i);
  });

  it('opens a modal to confirm deletion', () => {
    renderComponent();
    expect(
      screen.queryByText(/are you sure you want to delete this account/i)
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByRole('listitem'));
    expect(
      screen.queryByText(/are you sure you want to delete this account/i)
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByRole('button', { name: /no, cancel this action/i })
    );
    expect(
      screen.queryByText(/are you sure you want to delete this account/i)
    ).not.toBeInTheDocument();
  });

  it("requests the deletion of the user's account", async () => {
    // TODO: redirect to root, show success banner
  });
});
