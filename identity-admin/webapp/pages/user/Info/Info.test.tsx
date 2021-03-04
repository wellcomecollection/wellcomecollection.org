import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { Info } from './Info';
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
      <Info />
    </UserInfoProvider>
  );
};

describe('Info', () => {
  it('has a second-level heading with the name of the user profile being edited', async () => {
    renderComponent();
    const secondaryHeading = await screen.findByRole('heading', {
      level: 2,
      name: 'Edit user profile: Steve Rogers',
    });
    expect(secondaryHeading).toBeInTheDocument();
  });

  describe('status', () => {
    it('is not shown by default', async () => {
      renderComponent();
      await waitFor(expect(screen.getByText(/loading/i)).not.toBeInTheDocument);
      const userStatus = screen.queryByRole('complementary');
      expect(userStatus).not.toBeInTheDocument();
    });

    it('shows that an account has been blocked', async () => {
      renderComponent({ locked: true });
      await waitFor(expect(screen.getByText(/loading/i)).not.toBeInTheDocument);
      const userStatus = screen.getByRole('complementary');
      expect(userStatus).toBeInTheDocument();
      expect(userStatus).toHaveTextContent(/account blocked/i);
    });

    it('shows that an account has requested deletion', async () => {
      renderComponent({
        locked: true,
        deleteRequested: '2021-02-18T12:37:58.305Z',
      });
      await waitFor(expect(screen.getByText(/loading/i)).not.toBeInTheDocument);
      const userStatus = screen.getByRole('complementary');
      expect(userStatus).toBeInTheDocument();
      expect(userStatus).toHaveTextContent(/user has requested delete/i);
    });

    it("shows that an account's email is not validated", async () => {
      renderComponent({ emailValidated: false });
      await waitFor(expect(screen.getByText(/loading/i)).not.toBeInTheDocument);
      const userStatus = screen.getByRole('complementary');
      expect(userStatus).toBeInTheDocument();
      expect(userStatus).toHaveTextContent(/waiting activation/i);
    });
  });
});
