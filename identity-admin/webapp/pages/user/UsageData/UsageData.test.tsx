import React from 'react';
import { render, screen } from '@testing-library/react';
import { UsageData } from './UsageData';
import { TestUserInfoProvider, UserInfoContextState } from '../UserInfoContext';
import { mockUser } from '../../../mocks/UserInfo.mock';

const defaultContext: UserInfoContextState = {
  isLoading: false,
  user: mockUser,
  refetch: jest.fn(),
};

const renderComponent = (context = defaultContext) =>
  render(
    <TestUserInfoProvider value={context}>
      <UsageData />
    </TestUserInfoProvider>
  );

describe('UsageData', () => {
  it("displays the date the user's account was created", () => {
    renderComponent({
      ...defaultContext,
      user: {
        ...mockUser,
        creationDate: '2021-01-11T15:40:00.000Z',
      },
    });
    expect(screen.getByText(/creation date/i)).toBeInTheDocument();
    expect(screen.getByText('11/01/2021 15:40:00')).toBeInTheDocument();
  });

  it("displays the date the user's account was last updated", () => {
    renderComponent({
      ...defaultContext,
      user: {
        ...mockUser,
        updatedDate: '2021-02-14T10:35:28.583Z',
      },
    });
    expect(screen.getByText(/last update/i)).toBeInTheDocument();
    expect(screen.getByText('14/02/2021 10:35:28')).toBeInTheDocument();
  });

  it('displays the date the user last logged in', () => {
    renderComponent({
      ...defaultContext,
      user: {
        ...mockUser,
        lastLoginDate: '2021-02-23T09:20:32.507Z',
      },
    });
    expect(screen.getByText(/last login$/i)).toBeInTheDocument();
    expect(screen.getByText('23/02/2021 09:20:32')).toBeInTheDocument();
  });

  it('displays the IP the user last logged in from', () => {
    renderComponent({
      ...defaultContext,
      user: {
        ...mockUser,
        lastLoginIp: '152.46.67.221',
      },
    });
    expect(screen.getByText(/last login ip/i)).toBeInTheDocument();
    expect(screen.getByText('152.46.67.221')).toBeInTheDocument();
  });

  it('displays the number of times the user has logged in', () => {
    renderComponent({
      ...defaultContext,
      user: {
        ...mockUser,
        totalLogins: 138,
      },
    });
    expect(screen.getByText(/total logins/i)).toBeInTheDocument();
    expect(screen.getByText('138')).toBeInTheDocument();
  });
});
