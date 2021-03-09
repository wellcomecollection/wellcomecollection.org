import React from 'react';
import { render, screen } from '../test-utils';
import { ProfileForm, ProfileFormProps } from './ProfileForm';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import * as apiClient from '../../utility/middleware-api-client';

jest.mock('../../utility/middleware-api-client');

const callMiddlewareApi = apiClient.callMiddlewareApi as jest.Mock;

const defaultProps: ProfileFormProps = {
  firstName: 'Bruce',
  lastName: 'Wayne',
  email: 'bruciebaby@justiceleague.com',
  barcode: '1234567',
  onUpdate: jest.fn(),
};

const renderComponent = (props = defaultProps) => render(<ProfileForm {...props} />);

describe('ProfileForm', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /change email/i })).toBeInTheDocument();
  });

  it('lets the user update their email address with a valid new address', () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email address/i);
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    expect(emailInput).toHaveValue(defaultProps.email);
    expect(saveButton).toBeDisabled();
    userEvent.clear(emailInput);
    expect(saveButton).toBeDisabled(); // because email is not valid
    userEvent.type(emailInput, 'batman');
    expect(saveButton).toBeDisabled(); // because email is not valid
    userEvent.type(emailInput, '@justiceleague.com');
    expect(saveButton).toBeEnabled();
  });

  it('posts a valid email and password to the API', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const saveButton = screen.getByRole('button', { name: /save changes/i });

    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'batman@justiceleague.com');
    userEvent.type(passwordInput, 'D4rkKnight1');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    callMiddlewareApi.mockResolvedValue({ status: 200 });
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(callMiddlewareApi).toBeCalledWith('PUT', '/api/users/me', {
        newEmail: 'batman@justiceleague.com',
        password: 'D4rkKnight1',
      });
      expect(saveButton).toBeDisabled();
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(
        /your email has been updated - please check your inbox to verify this change/i
      );
    });
  });

  it('warns the user when they try to update with an email that already exists', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const saveButton = screen.getByRole('button', { name: /save changes/i });

    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'superman@justiceleague.com');
    userEvent.type(passwordInput, 'D4rkKnight1');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    callMiddlewareApi.mockRejectedValue({
      response: {
        status: 409,
        message: 'An attempt to update the record to an email address which already exists was made.',
      },
    });
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/^this account already exists/i);
    });
  });

  it('warns the user when they try to update with an incorrect password', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const saveButton = screen.getByRole('button', { name: /save changes/i });

    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'batman@justiceleague.com');
    userEvent.type(passwordInput, 'dolphins');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    callMiddlewareApi.mockRejectedValue({
      response: { status: 401, message: 'The provided password is incorrect.' },
    });
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/incorrect password/i);
    });
  });

  it('opens a modal to let the user request account deletion', () => {
    renderComponent();
    expect(screen.queryByRole('heading', { name: /delete account/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /yes, delete my account/i })).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /delete account/i }));

    expect(screen.queryByRole('heading', { name: /delete account/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /yes, delete my account/i })).toBeInTheDocument();
  });

  it('closes the delete modal when the user cancels', () => {
    renderComponent();
    userEvent.click(screen.getByRole('button', { name: /delete account/i }));
    expect(screen.queryByRole('heading', { name: /delete account/i })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'No, take me back to my account' }));
    expect(screen.queryByRole('heading', { name: /delete account/i })).not.toBeInTheDocument();
  });
});
