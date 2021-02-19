import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
