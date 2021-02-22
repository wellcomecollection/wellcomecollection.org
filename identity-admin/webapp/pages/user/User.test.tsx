import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import User from './User';
import { TestUserInfoProvider, UserInfoContextState } from './UserInfoContext';
import { mockUser } from '../../mocks/UserInfo.mock';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { userId: '1234567' },
    };
  },
}));

const defaultContext: UserInfoContextState = {
  isLoading: false,
  user: mockUser,
  refetch: () => null,
};

const renderPage = (context = defaultContext) =>
  render(
    <TestUserInfoProvider value={context}>
      <User />
    </TestUserInfoProvider>
  );

describe('User', () => {
  it('has a top-level heading which links to the main screen', async () => {
    renderPage();
    const heading = screen.getByRole('heading', { level: 1 });
    await waitFor(() => {
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/account administration/i);
      expect(heading.firstChild).toHaveAttribute('href', '/');
    });
  });
});
