import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DeleteAccount } from './DeleteAccount';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const renderComponent = () => render(<DeleteAccount userId={123} />);

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

  it("deletes the user's account", async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({ push }));

    renderComponent();
    userEvent.click(screen.getByRole('listitem'));
    userEvent.click(
      screen.getByRole('button', { name: /yes, delete account/i })
    );
    await waitFor(() => {
      expect(push).toBeCalledWith({
        pathname: '/',
        query: { deletedUser: 123 },
      });
    });
  });
});
