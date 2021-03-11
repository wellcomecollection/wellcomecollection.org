import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import { Profile } from './Profile';
import { UserInfoProvider } from '../../context/UserInfoContext';
import { mockUser } from '../../__mocks__/UserInfo.mock';

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: { userId: '123' },
    };
  },
}));

const renderComponent = () =>
  render(
    <UserInfoProvider>
      <Profile />
    </UserInfoProvider>
  );

const waitForPageToLoad = async () => {
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  );
};

describe('Profile', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("shows the user's library card number", async () => {
    renderComponent();
    await waitForPageToLoad();
    expect(screen.getByText(mockUser.barcode)).toBeInTheDocument();
  });

  it("shows the user's patron record number", async () => {
    renderComponent();
    await waitForPageToLoad();
    expect(screen.getByText(mockUser.patronId)).toBeInTheDocument();
  });

  it("lets the admin edit the user's name and email", async () => {
    renderComponent();
    await waitForPageToLoad();
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

  it('submits the edited user details and refreshes', async () => {
    renderComponent();
    await waitForPageToLoad();

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
      expect(screen.getByText(/updating/i)).toBeInTheDocument();
    });
    expect(firstNameInput).not.toBeInTheDocument();
    expect(lastNameInput).not.toBeInTheDocument();
    expect(emailInput).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
    expect(firstNameInput).not.toBeInTheDocument();
    expect(lastNameInput).not.toBeInTheDocument();
    expect(emailInput).not.toBeInTheDocument();

    await waitForPageToLoad();

    expect(firstNameInput).toHaveValue('Tony');
    expect(lastNameInput).toHaveValue('Stark');
    expect(emailInput).toHaveValue('iamironman@starkindustries.com');
  });

  it('halts submit and shows a warning if the first name is blank', async () => {
    renderComponent();
    await waitForPageToLoad();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.clear(screen.getByLabelText(/first name/i));
    userEvent.click(screen.getByRole('button', { name: /update details/i }));
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /first name cannot be blank/i
      );
    });
    expect(screen.queryByText(/updating/i)).not.toBeInTheDocument();
  });

  it('halts submit and shows a warning if the last name is blank', async () => {
    renderComponent();
    await waitForPageToLoad();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.clear(screen.getByLabelText(/last name/i));
    userEvent.click(screen.getByRole('button', { name: /update details/i }));
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /last name cannot be blank/i
      );
    });
    expect(screen.queryByText(/updating/i)).not.toBeInTheDocument();
  });

  it('halts submit and shows a warning if the email is blank or invalid', async () => {
    renderComponent();
    await waitForPageToLoad();
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
    });
    expect(screen.queryByText(/updating/i)).not.toBeInTheDocument();

    userEvent.type(emailInput, 'captainamerica@avengers'); // not a valid email
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /invalid email address/i
      );
    });
    expect(screen.queryByText(/updating/i)).not.toBeInTheDocument();
  });
});
