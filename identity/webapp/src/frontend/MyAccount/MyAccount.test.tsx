import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { UserContextProvider } from '@weco/common/contexts/UserContext';
import { ServerData } from '@weco/common/server-data/types';
import {
  mockAuth0Profile,
  mockItemRequests,
  mockUser,
} from '@weco/common/test/fixtures/identity/user';
import theme from '@weco/common/views/themes/default';
import AccountPage from '@weco/identity/pages';

// avoid rendering header SVG to help with debugging tests
jest.mock('@weco/identity/src/frontend/components/PageWrapper', () => ({
  __esModule: true,
  PageWrapper: ({ children }) => <>{children}</>,
}));

jest.mock('@weco/common/server-data', () => ({
  __esModule: true,
  getServerData: async () =>
    (await import('@weco/common/server-data/types')).defaultServerData,
}));

jest.mock('next/config', () => () => ({
  serverRuntimeConfig: {
    sessionKeys: 'test_test_test',
    siteBaseUrl: 'http://test.test',
    identityBasePath: '/account',
    auth0: {
      domain: 'test.test',
      clientID: 'test',
      clientSecret: 'test',
    },
    remoteApi: {
      host: 'test.test',
      apiKey: 'test',
    },
  },
}));

jest.mock('next/router', () => require('next-router-mock'));

const renderComponent = (user = mockAuth0Profile) =>
  render(
    <ThemeProvider theme={theme}>
      <UserContextProvider>
        <AccountPage user={user} serverData={{} as ServerData} />
      </UserContextProvider>
    </ThemeProvider>
  );

describe('MyAccount', () => {
  it('shows a page title', async () => {
    renderComponent();
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Library account/i);
  });

  it('informs the user when their email has not been validated', async () => {
    renderComponent({ ...mockAuth0Profile, email_verified: false });
    expect(
      await screen.findByText(/Please verify your email address/i)
    ).toBeInTheDocument();
  });

  it('does not show an email validation warning by default', async () => {
    renderComponent();
    await waitFor(() => {
      expect(
        screen.queryByRole('status', {
          name: /loading/i,
          hidden: true,
        })
      ).not.toBeInTheDocument();
    });
    expect(
      screen.queryByText(/Please verify your email address/i)
    ).not.toBeInTheDocument();
  });

  it("shows the user's name", async () => {
    renderComponent();
    const name = await screen.findByText(
      `${mockUser.firstName} ${mockUser.lastName}`
    );
    expect(name).toBeInTheDocument();
  });

  it("shows the user's library card number", async () => {
    renderComponent();
    const barcode = await screen.findByText(mockUser.barcode);
    expect(barcode).toBeInTheDocument();
  });

  it("shows the user's email address", async () => {
    renderComponent();
    const email = await screen.findAllByText(mockUser.email);
    await expect(email[0]).toBeVisible();
  });

  it("shows the user's item requests", async () => {
    renderComponent();
    const requestTitle = await screen.findByText(
      mockItemRequests.results[0].item.title!
    );
    expect(requestTitle).toBeInTheDocument();
  });

  it('opens a modal where the user can update their email', async () => {
    renderComponent();
    expect(
      screen.queryByRole('heading', { name: /change email/i })
    ).not.toBeInTheDocument();

    const changeEmailButton = await screen.findByRole('button', {
      name: /change email/i,
    });
    userEvent.click(changeEmailButton);

    expect(
      await screen.findByRole('heading', { name: /change email/i })
    ).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    userEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /change email/i })
      ).not.toBeInTheDocument();
    });
  });

  it('opens a modal where the user can update their password', async () => {
    renderComponent();

    expect(
      screen.queryByRole('heading', { name: /change password/i })
    ).not.toBeInTheDocument();

    const changePasswordButton = await screen.findByRole('button', {
      name: /change password/i,
    });
    userEvent.click(changePasswordButton);

    expect(
      await screen.findByRole('heading', { name: /change password/i })
    ).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    userEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /change password/i })
      ).not.toBeInTheDocument();
    });
  });

  it('shows a status message after the user updates their email', async () => {
    renderComponent();

    const changeEmailButton = await screen.findByRole('button', {
      name: /change email/i,
    });
    await act(async () => userEvent.click(changeEmailButton));

    const emailInput = await screen.findByLabelText(/email address/i);
    const passwordConfirmInput = screen.getByLabelText(/confirm password/i);

    await act(async () => {
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'clarkkent@dailybugle.com');
      await userEvent.type(passwordConfirmInput, 'Superman1938');
    });

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    const updateEmailButton = screen.getByRole('button', {
      name: /update email/i,
    });
    await act(async () => userEvent.click(updateEmailButton));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /email updated/i
    );
  });

  it('shows a status message after the user updates their password', async () => {
    renderComponent();

    const changePasswordButton = await screen.findByRole('button', {
      name: /Change password/,
    });
    await act(async () => userEvent.click(changePasswordButton));

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/^create new password/i);
    const confirmPasswordInput = screen.getByLabelText(
      /re-enter new password/i
    );

    await act(async () => {
      await userEvent.type(currentPasswordInput, 'hunter2');
      await userEvent.type(newPasswordInput, 'Superman1938');
      await userEvent.type(confirmPasswordInput, 'Superman1938');
    });

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    const updatePasswordButton = screen.getByRole('button', {
      name: /update password/i,
    });
    await act(async () => userEvent.click(updatePasswordButton));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /password updated/i
    );
  });

  it('opens a modal where the user can request their account be deleted', async () => {
    renderComponent();

    expect(
      screen.queryByRole('heading', { name: /delete this account/i })
    ).not.toBeInTheDocument();

    const requestDeletionButton = await screen.findByRole('button', {
      name: /cancel your membership/i,
    });
    await act(async () => userEvent.click(requestDeletionButton));

    expect(
      await screen.findByRole('button', { name: /yes, delete my account/i })
    ).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    await act(async () => userEvent.click(closeButton));

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /yes, delete my account/i })
      ).not.toBeInTheDocument();
    });
  });
});
