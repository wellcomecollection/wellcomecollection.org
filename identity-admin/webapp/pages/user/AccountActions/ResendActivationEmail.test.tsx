import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ResendActivationEmail } from './ResendActivationEmail';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: { userId: '3141592' },
    };
  },
}));

const renderComponent = () => render(<ResendActivationEmail />);

describe('ResendActivationEmail', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: /resend activation email/i })
    ).toBeInTheDocument();
  });

  it('requests the sending of a new activation email', async () => {
    renderComponent();
    userEvent.click(
      screen.getByRole('button', { name: /resend activation email/i })
    );

    await waitFor(() => {
      expect(fetch).toBeCalledWith('/api/resend-activation-email/3141592', {
        method: 'put',
      });
    });
  });
});
