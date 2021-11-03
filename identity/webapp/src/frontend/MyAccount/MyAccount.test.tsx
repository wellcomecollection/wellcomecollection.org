import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AccountPage from '../../../pages/account';
import {
  mockItemRequests,
  mockUser,
} from '@weco/common/test/fixtures/identity/user';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import UserProvider from '@weco/common/views/components/UserProvider/UserProvider';
import { server } from '../mocks/server';
import { rest } from 'msw';

// avoid rendering header SVG to help with debugging tests
jest.mock('../components/PageWrapper', () => ({
  __esModule: true,
  PageWrapper: ({ children }) => <>{children}</>, // eslint-disable-line react/display-name
}));

jest.mock('@weco/common/server-data', () => ({
  __esModule: true,
  getServerData: async () =>
    (await import('@weco/common/server-data/types')).defaultServerData,
}));

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <UserProvider forceEnable={true}>
        <AccountPage />
      </UserProvider>
    </ThemeProvider>
  );

describe('MyAccount', () => {
  it('shows an indicator while loading user data', async () => {
    renderComponent();
    const loading = screen.getByRole('status', {
      name: /loading/i,
      hidden: true,
    });
    expect(loading).toBeInTheDocument();
  });

  it('shows a page title', async () => {
    renderComponent();
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Library account/i);
  });

  it('informs the user when their email has not been validated', async () => {
    server.use(
      rest.get('/account/api/users/me', (req, res, ctx) => {
        return res.once(ctx.json({ ...mockUser, emailValidated: false }));
      })
    );

    renderComponent();
    expect(
      await screen.findByText(/you have not yet validated your email address/i)
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
      screen.queryByText(/you have not yet validated your email address/i)
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
    expect(email[0]).toBeVisible();
  });

  it("shows the user's item requests", async () => {
    renderComponent();
    const requestTitle = await screen.findByText(
      mockItemRequests.results[0].item.title
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
    userEvent.click(changeEmailButton);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordConfirmInput = screen.getByLabelText(/confirm password/i);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'clarkkent@dailybugle.com');
    userEvent.type(passwordConfirmInput, 'Superman1938');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    const updateEmailButton = screen.getByRole('button', {
      name: /update email/i,
    });
    userEvent.click(updateEmailButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /email updated/i
    );
    const email = screen.queryAllByText('clarkkent@dailybugle.com');
    expect(email[0]).toBeVisible();
  });

  it('shows a status message after the user updates their password', async () => {
    renderComponent();

    const changePasswordButton = await screen.findByRole('button', {
      name: /Change password/,
    });
    userEvent.click(changePasswordButton);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/^create new password/i);
    const confirmPasswordInput = screen.getByLabelText(
      /re-enter new password/i
    );
    userEvent.type(currentPasswordInput, 'hunter2');
    userEvent.type(newPasswordInput, 'Superman1938');
    userEvent.type(confirmPasswordInput, 'Superman1938');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    const updatePasswordButton = screen.getByRole('button', {
      name: /update password/i,
    });
    userEvent.click(updatePasswordButton);

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
    userEvent.click(requestDeletionButton);

    expect(
      await screen.findByRole('button', { name: /yes, delete my account/i })
    ).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    userEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /yes, delete my account/i })
      ).not.toBeInTheDocument();
    });
  });
});
