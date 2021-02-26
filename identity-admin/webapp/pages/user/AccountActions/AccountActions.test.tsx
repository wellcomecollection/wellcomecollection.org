import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { AccountActions } from './AccountActions';
import { UserInfoProvider } from '../UserInfoContext';
import { mockUser } from '../../../__mocks__/UserInfo.mock';
import { server } from '../../../__mocks__/server';
import { UserInfo } from '../../../types/UserInfo';

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
    expect(
      screen.getByRole('button', { name: /resend activation email/i })
    ).toBeInTheDocument();
  });

  it('can block an unblocked user', async () => {
    renderComponent({ locked: false });
    await waitForPageToLoad();
    expect(
      screen.getByRole('button', { name: /^block online account/i })
    ).toBeInTheDocument();
  });

  it('can unblock a blocked user', async () => {
    renderComponent({ locked: true });
    await waitForPageToLoad();
    expect(
      screen.getByRole('button', { name: /unblock online account/i })
    ).toBeInTheDocument();
  });

  it("can delete a user's account", async () => {
    renderComponent();
    await waitForPageToLoad();
    expect(
      screen.getByRole('button', { name: /delete account/i })
    ).toBeInTheDocument();
  });

  it('can reverse a delete request', async () => {
    renderComponent({ deleteRequested: '2021-02-14T10:35:28.583Z' });
    await waitForPageToLoad();
    expect(
      screen.queryByRole('button', { name: /reverse user's deletion request/i })
    ).toBeInTheDocument();
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
    expect(
      screen.getByRole('button', { name: /reset password/i })
    ).toBeInTheDocument();
  });
});
