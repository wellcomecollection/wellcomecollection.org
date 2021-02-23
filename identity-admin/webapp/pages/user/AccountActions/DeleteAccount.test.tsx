import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
    expect(
      screen.getByRole('button', { name: /delete account/i })
    ).toBeInTheDocument();
  });

  it("requests the deletion of the user's account", async () => {
    renderComponent();
    userEvent.click(screen.getByRole('button', { name: /delete account/i }));

    await waitFor(() => {
      expect(fetch).toBeCalledWith('/api/delete-account/3141592', {
        method: 'put',
      });
    });
  });
});
