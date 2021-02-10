import React from 'react';
import axios from 'axios';
import { render, screen } from '../test-utils';
import { ProfileForm } from './ProfileForm';
import { UserInfo } from '../hooks/useUserInfo';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const defaultProps: UserInfo = {
  firstName: 'Bruce',
  lastName: 'Wayne',
  email: 'bruciebaby@justiceleague.com',
  barcode: '1234567',
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

    mockedAxios.put.mockResolvedValue({ status: 200 });
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.put).toBeCalledWith('/api/users/me', {
        email: defaultProps.email,
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

    mockedAxios.put.mockRejectedValue({
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

    mockedAxios.put.mockRejectedValue({
      response: { status: 401, message: 'The provided password is incorrect.' },
    });
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/incorrect password/i);
    });
  });
});
