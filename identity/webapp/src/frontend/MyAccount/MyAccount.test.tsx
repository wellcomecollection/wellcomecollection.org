import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MyAccount } from './MyAccount';
import { mockUser } from '../mocks/user';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <MyAccount />
    </ThemeProvider>
  );

describe('MyAccount', () => {
  it('shows an indicator while loading user data', () => {
    renderComponent();
    const loading = screen.getByLabelText(/loading/i);
    expect(loading).toBeInTheDocument();
  });

  it('shows a page title', async () => {
    renderComponent();
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/my account/i);
  });

  it("shows the user's name", async () => {
    renderComponent();
    expect(await screen.findByText(`${mockUser.firstName} ${mockUser.lastName}`)).toBeInTheDocument();
  });

  it("shows the user's library card number", async () => {
    renderComponent();
    expect(await screen.findByText(mockUser.barcode)).toBeInTheDocument();
  });

  it("shows the user's email address", async () => {
    renderComponent();
    expect(await screen.findByText(mockUser.email)).toBeInTheDocument();
  });

  it('opens a modal where the user can update their email', async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument());
    expect(screen.queryByRole('heading', { name: /change email/i })).not.toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /update email/i }));
    expect(screen.queryByRole('heading', { name: /change email/i })).toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /close/i }));
    expect(screen.queryByRole('heading', { name: /change email/i })).not.toBeInTheDocument();
  });

  it("shows a mock of the user's password", async () => {
    renderComponent();
    expect(await screen.findByText('********')).toBeInTheDocument();
  });

  it('opens a modal where the user can update their password', async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument());
    expect(screen.queryByRole('heading', { name: /change password/i })).not.toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /update password/i }));
    expect(screen.queryByRole('heading', { name: /change password/i })).toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /close/i }));
    expect(screen.queryByRole('heading', { name: /change password/i })).not.toBeInTheDocument();
  });

  it('opens a modal where the user can request their account be deleted', async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument());
    expect(screen.queryByRole('heading', { name: /delete this account/i })).not.toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /request deletion/i }));
    expect(screen.queryByRole('heading', { name: /delete this account/i })).toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /close/i }));
    expect(screen.queryByRole('heading', { name: /delete this account/i })).not.toBeInTheDocument();
  });
});
