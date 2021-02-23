import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ResetPassword } from './ResetPassword';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: { userId: '3141592' },
    };
  },
}));

const renderComponent = () => render(<ResetPassword />);

describe('ResetPassword', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: /reset password/i })
    ).toBeInTheDocument();
  });

  it("requests the reset of a user's password", async () => {
    renderComponent();
    userEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(fetch).toBeCalledWith('/api/reset-password/3141592', {
        method: 'put',
      });
    });
  });
});
