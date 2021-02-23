import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import { Profile } from './Profile';
import { TestUserInfoProvider, UserInfoContextState } from '../UserInfoContext';
import { mockUser } from '../../../mocks/UserInfo.mock';

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
  refetch: jest.fn(),
};

const renderComponent = (context = defaultContext) =>
  render(
    <TestUserInfoProvider value={context}>
      <Profile />
    </TestUserInfoProvider>
  );

describe('Profile', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

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
      expect(fetch).toBeCalledWith('/api/user/3141592', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Tony',
          lastName: 'Stark',
          email: 'iamironman@starkindustries.com',
        }),
      });
    });
  });

  it('halts submit and shows a warning if the first name is blank', async () => {
    renderComponent();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.clear(screen.getByLabelText(/first name/i));
    userEvent.click(screen.getByRole('button', { name: /update details/i }));
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /first name cannot be blank/i
      );
      expect(fetch).not.toBeCalled();
    });
  });

  it('halts submit and shows a warning if the last name is blank', async () => {
    renderComponent();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.clear(screen.getByLabelText(/last name/i));
    userEvent.click(screen.getByRole('button', { name: /update details/i }));
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /last name cannot be blank/i
      );
      expect(fetch).not.toBeCalled();
    });
  });

  it('halts submit and shows a warning if the email is blank or invalid', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', {
      name: /update details/i,
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.clear(emailInput);
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /email address cannot be blank/i
      );
      expect(fetch).not.toBeCalled();
    });
    userEvent.type(emailInput, 'captainamerica@avengers'); // not a valid email
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /invalid email address/i
      );
      expect(fetch).not.toBeCalled();
    });
  });

  it('refetches data after submit', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', {
      name: /update details/i,
    });
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'captainamerica@avengers.com');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toBeCalled();
      expect(defaultContext.refetch).toBeCalled();
    });
  });
});
