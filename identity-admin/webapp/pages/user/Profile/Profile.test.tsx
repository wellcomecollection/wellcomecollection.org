import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Profile } from './Profile';
import {
  mockUser,
  TestUserInfoProvider,
  UserInfoContextState,
} from '../UserInfoContext';

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
});
