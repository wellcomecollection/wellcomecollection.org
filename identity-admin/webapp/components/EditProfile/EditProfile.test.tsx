import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { EditProfile } from './EditProfile';
import { UserInfoProvider } from '../../context/UserInfoContext';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { userId: '123' },
    };
  },
}));

const renderPage = () =>
  render(
    <UserInfoProvider>
      <EditProfile />
    </UserInfoProvider>
  );

describe('EditProfile', () => {
  it('shows a loading component', async () => {
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
  });

  it('has a top-level heading which links to the main screen', async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/account administration/i);
    expect(heading.firstChild).toHaveAttribute('href', '/');
  });
});
