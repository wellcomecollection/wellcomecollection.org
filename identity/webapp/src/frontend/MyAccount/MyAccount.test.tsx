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
import { server } from '../mocks/server';
import { rest } from 'msw';

// avoid rendering header SVG to help with debugging tests
jest.mock('../components/PageWrapper', () => ({
  __esModule: true,
  PageWrapper: ({ children }) => <>{children}</>, // eslint-disable-line react/display-name
}));

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <AccountPage />
    </ThemeProvider>
  );

const waitForLoad = () =>
  waitFor(() =>
    expect(screen.queryByLabelText(/Loading/i)).not.toBeInTheDocument()
  );

describe('MyAccount', () => {
  it('shows an indicator while loading user data', async () => {
    renderComponent();
    const loading = await screen.findByText(/Loading/);
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
        return res(ctx.json({ ...mockUser, emailValidated: false }));
      })
    );
    renderComponent();
    await waitForLoad();
    expect(
      screen.queryByText(/you have not yet validated your email address/i)
    ).not.toBeInTheDocument();
  });

  it('does not show an email validation warning by default', async () => {
    renderComponent();
    await waitForLoad();
    expect(
      screen.queryByText(/you have not yet validated your email address/i)
    ).not.toBeInTheDocument();
  });

  it("shows the user's name", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
    );
    expect(
      await screen.findByText(`${mockUser.firstName} ${mockUser.lastName}`)
    ).toBeInTheDocument();
  });

  it("shows the user's library card number", async () => {
    renderComponent();
    await waitForLoad();
    expect(await screen.findByText(mockUser.barcode)).toBeInTheDocument();
  });

  it("shows the user's email address", async () => {
    renderComponent();
    await waitForLoad();
    expect(await screen.findByText(mockUser.email)).toBeInTheDocument();
  });

  it("shows the user's item requests", async () => {
    renderComponent();
    await waitForLoad();
    expect(
      await screen.findByText(mockItemRequests.results[0].item.title)
    ).toBeInTheDocument();
  });

  it('opens a modal where the user can update their email', async () => {
    renderComponent();
    await waitForLoad();
    expect(
      screen.queryByRole('heading', { name: /change email/i })
    ).not.toBeInTheDocument();
    userEvent.click(
      await screen.findByRole('button', { name: /change email/i })
    );
    expect(
      await screen.findByRole('heading', { name: /change email/i })
    ).toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /close/i }));
    expect(
      screen.queryByRole('heading', { name: /change email/i })
    ).not.toBeInTheDocument();
  });

  it('opens a modal where the user can update their password', async () => {
    renderComponent();
    await waitForLoad();
    expect(
      screen.queryByRole('heading', { name: /change password/i })
    ).not.toBeInTheDocument();
    userEvent.click(
      await screen.findByRole('button', { name: /change password/i })
    );
    expect(
      await screen.findByRole('heading', { name: /change password/i })
    ).toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /close/i }));
    expect(
      screen.queryByRole('heading', { name: /change password/i })
    ).not.toBeInTheDocument();
  });

  it('shows a status message after the user updates their email', async () => {
    renderComponent();
    await waitForLoad();
    userEvent.click(
      await screen.findByRole('button', { name: /Change email/ })
    );
    userEvent.clear(screen.getByLabelText(/email address/i));
    userEvent.type(
      screen.getByLabelText(/email address/i),
      'clarkkent@dailybugle.com'
    );
    userEvent.type(screen.getByLabelText(/confirm password/i), 'Superman1938');
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    userEvent.click(screen.getByRole('button', { name: /update email/i }));
    await waitFor(() =>
      expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /email updated/i
    );
    expect(
      await screen.findByText('clarkkent@dailybugle.com')
    ).toBeInTheDocument();
  });

  it('shows a status message after the user updates their password', async () => {
    renderComponent();
    await waitForLoad();
    userEvent.click(
      await screen.findByRole('button', { name: /Change password/ })
    );
    userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
    userEvent.type(
      await screen.findByLabelText(/^create new password/i),
      'Superman1938'
    );
    userEvent.type(
      await screen.findByLabelText(/re-enter new password/i),
      'Superman1938'
    );
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    userEvent.click(
      await screen.findByRole('button', { name: /update password/i })
    );
    await waitForLoad();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /password updated/i
    );
  });

  it('opens a modal where the user can request their account be deleted', async () => {
    renderComponent();
    await waitForLoad();
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /delete this account/i })
      ).not.toBeInTheDocument();
    });
    userEvent.click(
      await screen.findByRole('button', { name: /request deletion/i })
    );
    await waitForLoad();
    expect(
      await screen.findByRole('heading', { name: /delete this account/i })
    ).toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /delete this account/i })
      ).not.toBeInTheDocument();
    });
  });
});
