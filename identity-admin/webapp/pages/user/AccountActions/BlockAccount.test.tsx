import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BlockAccount } from './BlockAccount';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: { userId: '3141592' },
    };
  },
}));

const renderComponent = () => render(<BlockAccount />);

describe('BlockAccount', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: /block online account/i })
    ).toBeInTheDocument();
  });

  it("requests a block on a user's account", async () => {
    renderComponent();
    userEvent.click(
      screen.getByRole('button', { name: /block online account/i })
    );

    await waitFor(() => {
      expect(fetch).toBeCalledWith('/api/block-account/3141592', {
        method: 'put',
      });
    });
  });
});
