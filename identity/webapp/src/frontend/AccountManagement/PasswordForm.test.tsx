import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../test-utils';
import { PasswordForm } from './PasswordForm';
import * as apiClient from '../../utility/middleware-api-client';

jest.mock('../../utility/middleware-api-client');

const callMiddlewareApi = apiClient.callMiddlewareApi as jest.Mock;

const renderComponent = () => render(<PasswordForm />);

describe('PasswordForm', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText(/change your password using the form below/i)).toBeInTheDocument();
  });

  it('allows the user to enter their current password', () => {
    renderComponent();
    const currentPasswordInput = screen.getByLabelText(/current password/i);
    userEvent.type(currentPasswordInput, 'dolphins');
    expect(currentPasswordInput).toHaveValue('dolphins');
  });

  it('allows the user to enter a new password', () => {
    renderComponent();
    const newPasswordInput = screen.getByLabelText(/^new password/i);
    userEvent.type(newPasswordInput, 'hunter2');
    expect(newPasswordInput).toHaveValue('hunter2');
  });

  it('allows the user to confirm the new password', () => {
    renderComponent();
    const confirmPasswordInput = screen.getByLabelText(/retype new password/i);
    userEvent.type(confirmPasswordInput, 'hunter2');
    expect(confirmPasswordInput).toHaveValue('hunter2');
  });

  it('warns the user when the new password is invalid', () => {
    const getAlert = () =>
      screen.queryByText(/the password you have entered does not meet the password policy/i, {
        selector: 'div[role=alert]',
      });

    renderComponent();
    expect(getAlert()).not.toBeInTheDocument();

    const newPasswordInput = screen.getByLabelText(/^new password/i);

    userEvent.type(newPasswordInput, 'RedCat4'); // too short
    expect(getAlert()).toBeInTheDocument();

    userEvent.clear(newPasswordInput);
    userEvent.type(newPasswordInput, 'redpanda4'); // no capital
    expect(getAlert()).toBeInTheDocument();

    userEvent.clear(newPasswordInput);
    userEvent.type(newPasswordInput, 'REDPANDA4'); // no lowercase
    expect(getAlert()).toBeInTheDocument();

    userEvent.clear(newPasswordInput);
    userEvent.type(newPasswordInput, 'RedPanda'); // no number
    expect(getAlert()).toBeInTheDocument();

    userEvent.clear(newPasswordInput);
    userEvent.type(newPasswordInput, 'RedPanda4'); // valid password
    expect(getAlert()).not.toBeInTheDocument();
  });

  it('warns the user when the new password does not match the confirmation', () => {
    const getAlert = () =>
      screen.queryByText(/the passwords you entered did not match/i, {
        selector: 'div[role=alert]',
      });

    renderComponent();
    expect(getAlert()).not.toBeInTheDocument();

    const newPasswordInput = screen.getByLabelText(/^new password/i);
    const confirmPasswordInput = screen.getByLabelText(/retype new password/i);

    userEvent.type(newPasswordInput, 'RedPanda4');
    expect(getAlert()).not.toBeInTheDocument(); // nothing confirmed yet

    userEvent.type(confirmPasswordInput, 'R');
    expect(getAlert()).toBeInTheDocument(); // warns as soon as typing starts

    userEvent.type(confirmPasswordInput, 'edPanda'); // entered: RedPanda
    expect(getAlert()).toBeInTheDocument();

    userEvent.type(confirmPasswordInput, '4'); // entered: RedPanda4
    expect(getAlert()).not.toBeInTheDocument(); // disappears when passwords match

    userEvent.type(confirmPasswordInput, '5'); // entered: RedPanda45
    expect(getAlert()).toBeInTheDocument();

    userEvent.clear(confirmPasswordInput);
    expect(getAlert()).toBeInTheDocument();
  });

  describe('submission', () => {
    let updatePasswordButton: HTMLElement,
      currentPasswordInput: HTMLElement,
      newPasswordInput: HTMLElement,
      confirmPasswordInput: HTMLElement;

    beforeEach(() => {
      renderComponent();
      updatePasswordButton = screen.getByRole('button', { name: /update password/i });
      currentPasswordInput = screen.getByLabelText(/current password/i);
      newPasswordInput = screen.getByLabelText(/^new password/i);
      confirmPasswordInput = screen.getByLabelText(/retype new password/i);
    });

    it('is disabled on first render', () => {
      expect(updatePasswordButton).toBeDisabled();
    });

    it('is disabled when the current password is missing', () => {
      userEvent.type(newPasswordInput, 'RedPanda4');
      userEvent.type(confirmPasswordInput, 'RedPanda4');
      expect(updatePasswordButton).toBeDisabled();
    });

    it('is disabled when the new password is missing', () => {
      userEvent.type(currentPasswordInput, 'dolphins');
      userEvent.type(confirmPasswordInput, 'RedPanda4');
      expect(updatePasswordButton).toBeDisabled();
    });

    it('is disabled when the confirmation is missing', () => {
      userEvent.type(currentPasswordInput, 'dolphins');
      userEvent.type(newPasswordInput, 'RedPanda4');
      expect(updatePasswordButton).toBeDisabled();
    });

    it('is disabled when the password and confirmation no not match', () => {
      userEvent.type(currentPasswordInput, 'dolphins');
      userEvent.type(newPasswordInput, 'RedPanda4');
      userEvent.type(confirmPasswordInput, 'NotRedPandas138');
      expect(updatePasswordButton).toBeDisabled();
    });

    it('is disabled when the password is confirmed but invalid', () => {
      userEvent.type(currentPasswordInput, 'dolphins');
      userEvent.type(newPasswordInput, 'redcat4');
      userEvent.type(confirmPasswordInput, 'redcat4');
      expect(updatePasswordButton).toBeDisabled();
    });

    it('is allowed when all three fields are complete and valid', () => {
      userEvent.type(currentPasswordInput, 'dolphins');
      userEvent.type(newPasswordInput, 'RedPanda4');
      userEvent.type(confirmPasswordInput, 'RedPanda4');
      expect(updatePasswordButton).toBeEnabled();
    });
  });

  describe('on submission', () => {
    let updatePasswordButton: HTMLElement;

    beforeEach(() => {
      renderComponent();
      userEvent.type(screen.getByLabelText(/current password/i), 'dolphins');
      userEvent.type(screen.getByLabelText(/^new password/i), 'RedPanda4');
      userEvent.type(screen.getByLabelText(/retype new password/i), 'RedPanda4');
      updatePasswordButton = screen.getByRole('button', { name: /update password/i });
    });

    test('current and new passwords are passed in request to API', async () => {
      callMiddlewareApi.mockResolvedValue({ status: 200 });
      userEvent.click(updatePasswordButton);

      await waitFor(() => {
        expect(callMiddlewareApi).toBeCalledWith('PUT', '/api/users/me/password', {
          currentPassword: 'dolphins',
          newPassword: 'RedPanda4',
        });
      });
    });
  });
});
