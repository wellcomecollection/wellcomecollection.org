import React from 'react';
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Profile } from './Profile';
import { TestUserInfoProvider, UserInfoContextState } from '../UserInfoContext';
import { mockUser } from '../../../mocks/UserInfo.mock';

jest.mock('axios');

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: { userId: '3141592' },
    };
  },
}));

const defaultContext: UserInfoContextState = {
  isLoading: false,
  user: mockUser,
};

const renderComponent = (context = defaultContext) =>
  render(
    <TestUserInfoProvider value={context}>
      <Profile />
    </TestUserInfoProvider>
  );

describe('Profile', () => {
  it("shows the user's library card number", () => {
    renderComponent();
    expect(screen.getByText(mockUser.barcode)).toBeInTheDocument();
  });

  it("shows the user's patron record number", () => {
    renderComponent();
    expect(screen.getByText(mockUser.patronId)).toBeInTheDocument();
  });

  it("lets the admin edit the user's name and email", () => {
    renderComponent();
    const firstNameInput = screen.getByLabelText(/first name/i);
    expect(firstNameInput).toHaveValue(mockUser.firstName);
    userEvent.clear(firstNameInput);
    userEvent.type(firstNameInput, 'Tony');
    expect(firstNameInput).toHaveValue('Tony');

    const lastNameInput = screen.getByLabelText(/last name/i);
    expect(lastNameInput).toHaveValue(mockUser.lastName);
    userEvent.clear(lastNameInput);
    userEvent.type(lastNameInput, 'Stark');
    expect(lastNameInput).toHaveValue('Stark');

    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toHaveValue(mockUser.email);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'iamironman@starkindustries.com');
    expect(emailInput).toHaveValue('iamironman@starkindustries.com');
  });

  it('submits the edited user details', async () => {
    renderComponent();
    const firstNameInput = screen.getByLabelText(/first name/i);
    userEvent.clear(firstNameInput);
    userEvent.type(firstNameInput, 'Tony');
    const lastNameInput = screen.getByLabelText(/last name/i);
    userEvent.clear(lastNameInput);
    userEvent.type(lastNameInput, 'Stark');
    const emailInput = screen.getByLabelText(/email address/i);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'iamironman@starkindustries.com');
    userEvent.click(screen.getByRole('button', { name: /update details/i }));
    await waitFor(() => {
      expect(axios.put).toBeCalledWith('/api/user/3141592', {
        firstName: 'Tony',
        lastName: 'Stark',
        email: 'iamironman@starkindustries.com',
      });
    });
  });
});
