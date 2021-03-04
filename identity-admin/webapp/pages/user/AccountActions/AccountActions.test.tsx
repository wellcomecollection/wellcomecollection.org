import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { AccountActions } from './AccountActions';
import { UserInfoProvider } from '../UserInfoContext';
import { mockUser } from '../../../__mocks__/UserInfo.mock';
import { server } from '../../../__mocks__/server';
import { UserInfo } from '../../../types/UserInfo';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: { userId: '123' },
    };
  },
}));

const renderComponent = (userOverride: Partial<UserInfo> = {}) => {
  server.use(
    rest.get(new RegExp('/api/user/123'), (_req, res, ctx) => {
      return res(ctx.json({ ...mockUser, ...userOverride }));
    })
  );
  return render(
    <UserInfoProvider>
      <AccountActions />
    </UserInfoProvider>
  );
};

const waitForPageToLoad = async () => {
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  );
};

describe('AccountActions', () => {
  it("can resend a user's activation email", async () => {
    renderComponent();
    await waitForPageToLoad();
    const resendActivationEmail = screen.getByRole('button', {
      name: /resend activation email/i,
    });
    expect(resendActivationEmail).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(resendActivationEmail);
    await waitFor(() => {
      const status = screen.queryByRole('alert');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('Activation email resent');
    });
  });

  it("shows an error when resending a user's activation email fails", async () => {
    server.use(
      rest.put(
        new RegExp('/api/resend-activation-email/123'),
        (_req, res, ctx) => {
          return res(ctx.status(400));
        }
      )
    );
    renderComponent();
    await waitForPageToLoad();
    const resendActivationEmail = screen.getByRole('button', {
      name: /resend activation email/i,
    });
    expect(resendActivationEmail).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(resendActivationEmail);
    await waitFor(() => {
      const status = screen.queryByRole('alert');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('Failed to send activation email');
    });
  });

  it('can block an unblocked user', async () => {
    renderComponent({ locked: false });
    await waitForPageToLoad();
    expect(
      screen.getByRole('button', { name: /^block online account/i })
    ).toBeInTheDocument();
  });

  it('can block an unblocked user', async () => {
    renderComponent({ locked: false });
    await waitForPageToLoad();
    const blockOnlineAccount = screen.getByRole('button', {
      name: /^block online account/i,
    });
    expect(blockOnlineAccount).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(blockOnlineAccount);
    await waitFor(() => {
      const status = screen.queryByRole('alert');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('User has been blocked');
    });
  });

  it('shows an error when blocking a user fails', async () => {
    server.use(
      rest.put(new RegExp('/api/block-account/123'), (_req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    renderComponent({ locked: false });
    await waitForPageToLoad();
    const blockOnlineAccount = screen.getByRole('button', {
      name: /^block online account/i,
    });
    expect(blockOnlineAccount).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(blockOnlineAccount);
    await waitFor(() => {
      const status = screen.queryByRole('alert');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('Failed to block user');
    });
  });

  it('can unblock a blocked user', async () => {
    renderComponent({ locked: true });
    await waitForPageToLoad();
    const unblockOnlineAccount = screen.getByRole('button', {
      name: /unblock online account/i,
    });
    expect(unblockOnlineAccount).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(unblockOnlineAccount);
    await waitFor(() => {
      const status = screen.queryByRole('alert');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('User has been unblocked');
    });
  });

  it('shows an error when unblocking a user fails', async () => {
    server.use(
      rest.put(new RegExp('/api/unblock-account/123'), (_req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    renderComponent({ locked: true });
    await waitForPageToLoad();
    const unblockOnlineAccount = screen.getByRole('button', {
      name: /unblock online account/i,
    });
    expect(unblockOnlineAccount).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(unblockOnlineAccount);
    await waitFor(() => {
      const status = screen.queryByRole('alert');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('Failed to unblock user');
    });
  });

  it('can reverse a delete request', async () => {
    renderComponent({ deleteRequested: '2021-02-14T10:35:28.583Z' });
    await waitForPageToLoad();
    const reverseDeleteRequest = screen.getByRole('button', {
      name: /reverse user's deletion request/i,
    });
    expect(reverseDeleteRequest).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(reverseDeleteRequest);
    await waitFor(() => {
      const status = screen.queryByRole('alert');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('Delete request reversed');
    });
  });

  it("shows an error when reversing a user's delete request fails", async () => {
    server.use(
      rest.put(
        new RegExp('/api/reverse-delete-request/123'),
        (_req, res, ctx) => {
          return res(ctx.status(400));
        }
      )
    );
    renderComponent({ deleteRequested: '2021-02-14T10:35:28.583Z' });
    await waitForPageToLoad();
    const reverseDeleteRequest = screen.getByRole('button', {
      name: /reverse user's deletion request/i,
    });
    expect(reverseDeleteRequest).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(reverseDeleteRequest);
    await waitFor(() => {
      const status = screen.queryByRole('alert');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('Failed to reverse delete request');
    });
  });

  it('cannot reverse a delete request if none exists', async () => {
    renderComponent({ deleteRequested: undefined });
    await waitForPageToLoad();
    expect(
      screen.queryByRole('button', {
        name: /reverse user's deletion request/i,
      })
    ).not.toBeInTheDocument();
  });

  it("can reset a user's password", async () => {
    renderComponent();
    await waitForPageToLoad();
    const resetPassword = screen.getByRole('button', {
      name: /reset password/i,
    });
    expect(resetPassword).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(resetPassword);
    await waitFor(() => {
      const status = screen.queryByRole('alert');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('Password reset');
    });
  });

  it("shows an error when resetting a user's password fails", async () => {
    server.use(
      rest.put(new RegExp('/api/reset-password/123'), (_req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    renderComponent();
    await waitForPageToLoad();
    const resetPassword = screen.getByRole('button', {
      name: /reset password/i,
    });
    expect(resetPassword).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(resetPassword);
    await waitFor(() => {
      const status = screen.queryByRole('alert');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('Failed to reset password');
    });
  });

  it("can delete a user's account", async () => {
    renderComponent();
    await waitForPageToLoad();
    expect(
      screen.getByRole('button', { name: /delete account/i })
    ).toBeInTheDocument();
  });
});
