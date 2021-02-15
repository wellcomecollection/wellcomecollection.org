import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../test-utils';
import { DeleteAccount } from './DeleteAccount';
import * as apiClient from '../../utility/middleware-api-client';

jest.mock('../../utility/middleware-api-client');

const callMiddlewareApi = apiClient.callMiddlewareApi as jest.Mock;

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

  it('passes the entered password to the deletion request endpoint', async () => {
    renderComponent();
    callMiddlewareApi.mockResolvedValue({ response: { status: 200 } });

    userEvent.type(screen.getByLabelText(/password/i), 'dolphins');
    userEvent.click(screen.getByRole('button', { name: /yes, delete my account/i }));

    await waitFor(() => {
      expect(callMiddlewareApi).toBeCalledWith('DELETE', '/api/users/me', {
        password: 'dolphins',
      });
    });
  });

  it('shows the success page if network request successful', async () => {
    renderComponent();
    callMiddlewareApi.mockResolvedValue({ response: { status: 200 } });
    const passwordInput = screen.getByLabelText(/password/i);
    const deleteButton = screen.getByRole('button', { name: /yes, delete my account/i });

    userEvent.type(passwordInput, 'dolphins');
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Your request for account deletion has been received.')).toBeInTheDocument();
      expect(passwordInput).not.toBeInTheDocument();
      expect(deleteButton).not.toBeInTheDocument();
    });
  });

  it('shows a warning when the password is incorrect', async () => {
    renderComponent();
    callMiddlewareApi.mockRejectedValue({ response: { status: 401 } });
    const passwordInput = screen.getByLabelText(/password/i);
    const deleteButton = screen.getByRole('button', { name: /yes, delete my account/i });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.type(passwordInput, 'dolphins');
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/incorrect password/i);
      expect(screen.queryByText('Your request for account deletion has been received.')).not.toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    expect(passwordInput).toHaveValue('');
    userEvent.type(passwordInput, 'h');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
