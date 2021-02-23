import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UnblockAccount } from './UnblockAccount';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: { userId: '3141592' },
    };
  },
}));

const renderComponent = () => render(<UnblockAccount />);

describe('UnblockAccount', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: /unblock online account/i })
    ).toBeInTheDocument();
  });

  it("requests the unblocking of a user's account", async () => {
    renderComponent();
    userEvent.click(
      screen.getByRole('button', { name: /unblock online account/i })
    );

    await waitFor(() => {
      expect(fetch).toBeCalledWith('/api/unblock-account/3141592', {
        method: 'put',
      });
    });
  });
});
