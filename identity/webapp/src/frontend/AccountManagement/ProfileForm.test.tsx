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

    mockedAxios.put.mockResolvedValue({ status: 200 });

    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'batman@justiceleague.com');
    userEvent.type(passwordInput, 'D4rkKnight1');
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.put).toBeCalledWith('/api/users/me', {
        email: defaultProps.email,
        newEmail: 'batman@justiceleague.com',
        password: 'D4rkKnight1',
      });
      expect(saveButton).toBeDisabled();
    });
  });
});
