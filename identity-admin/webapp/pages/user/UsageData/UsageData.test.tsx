import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { UsageData } from './UsageData';
import { UserInfoProvider } from '../UserInfoContext';
import { UserInfo } from '../../../types/UserInfo';
import { mockUser } from '../../../__mocks__/UserInfo.mock';
import { server } from '../../../__mocks__/server';

jest.mock('next/router', () => ({
  useRouter() {
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
      <UsageData />
    </UserInfoProvider>
  );
};

const waitForPageToLoad = async () => {
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  );
};

describe('UsageData', () => {
  it("displays the date the user's account was created", async () => {
    renderComponent({ creationDate: '2021-01-11T15:40:00.000Z' });
    await waitForPageToLoad();
    expect(screen.getByText(/creation date/i)).toBeInTheDocument();
    expect(screen.getByText('11/01/2021 15:40:00')).toBeInTheDocument();
  });

  it("displays the date the user's account was last updated", async () => {
    renderComponent({ updatedDate: '2021-02-14T10:35:28.583Z' });
    await waitForPageToLoad();
    expect(screen.getByText(/last update/i)).toBeInTheDocument();
    expect(screen.getByText('14/02/2021 10:35:28')).toBeInTheDocument();
  });

  it('displays the date the user last logged in', async () => {
    renderComponent({ lastLoginDate: '2021-02-23T09:20:32.507Z' });
    await waitForPageToLoad();
    expect(screen.getByText(/last login$/i)).toBeInTheDocument();
    expect(screen.getByText('23/02/2021 09:20:32')).toBeInTheDocument();
  });

  it('displays the IP the user last logged in from', async () => {
    renderComponent({ lastLoginIp: '152.46.67.221' });
    await waitForPageToLoad();
    expect(screen.getByText(/last login ip/i)).toBeInTheDocument();
    expect(screen.getByText('152.46.67.221')).toBeInTheDocument();
  });

  it('displays the number of times the user has logged in', async () => {
    renderComponent({ totalLogins: 138 });
    await waitForPageToLoad();
    expect(screen.getByText(/total logins/i)).toBeInTheDocument();
    expect(screen.getByText('138')).toBeInTheDocument();
  });
});
