import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccountActions } from './AccountActions';
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
      <AccountActions />
    </TestUserInfoProvider>
  );

describe('AccountActions', () => {
  it("can resend a user's activation email", () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: /resend activation email/i })
    ).toBeInTheDocument();
  });

  it('can block an unblocked user', () => {
    renderComponent({
      ...defaultContext,
      user: {
        ...mockUser,
        locked: false,
      },
    });
    expect(
      screen.getByRole('button', { name: /^block online account/i })
    ).toBeInTheDocument();
  });

  it('can unblock a blocked user', () => {
    renderComponent({
      ...defaultContext,
      user: {
        ...mockUser,
        locked: true,
      },
    });
    expect(
      screen.getByRole('button', { name: /unblock online account/i })
    ).toBeInTheDocument();
  });

  it("can delete a user's account", () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: /delete account/i })
    ).toBeInTheDocument();
  });

  it('can reverse a delete request', () => {
    renderComponent({
      ...defaultContext,
      user: {
        ...mockUser,
        deleteRequested: '2021-02-14T10:35:28.583Z',
      },
    });
    expect(
      screen.queryByRole('button', { name: /reverse user's deletion request/i })
    ).toBeInTheDocument();
  });

  it('cannot reverse a delete request if none exists', () => {
    const { deleteRequested, ...mockUserWithoutDeleteRequested } = mockUser;
    renderComponent({
      ...defaultContext,
      user: mockUserWithoutDeleteRequested,
    });
    expect(
      screen.queryByRole('button', {
        name: /reverse user's deletion request/i,
      })
    ).not.toBeInTheDocument();
  });

  it("can reset a user's password", () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: /reset password/i })
    ).toBeInTheDocument();
  });
});
