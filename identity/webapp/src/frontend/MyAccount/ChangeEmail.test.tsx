import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangeEmail } from './ChangeEmail';
import { UserInfoProvider } from './UserInfoContext';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { mockUser } from '../mocks/user';

const defaultProps: ChangeDetailsModalContentProps = {
  onComplete: () => null,
  onCancel: () => null,
};

const renderComponent = (props: Partial<ChangeDetailsModalContentProps> = {}) =>
  render(
    <ThemeProvider theme={theme}>
      <UserInfoProvider>
        <ChangeEmail {...defaultProps} {...props} />
      </UserInfoProvider>
    </ThemeProvider>
  );

describe('ChangeEmail', () => {
  it('renders correctly', async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument());
    expect(screen.queryByRole('heading', { name: /change email/i })).toBeInTheDocument();
  });

  it("displays a text input with the user's existing email", async () => {
    renderComponent();
    expect(await screen.findByLabelText(/email address/i)).toHaveValue(mockUser.email);
  });

  it('allows the user to enter an email address', async () => {
    renderComponent();
    const emailAddressInput = await screen.findByLabelText(/email address/i);
    userEvent.clear(emailAddressInput);
    userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
    expect(emailAddressInput).toHaveValue('clarkkent@dailybugle.com');
  });

  it('allows the user to confirm their password', async () => {
    renderComponent();
    const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);
    userEvent.type(confirmPasswordInput, 'Superman1938');
    expect(confirmPasswordInput).toHaveValue('Superman1938');
  });

  it('submits a complete and valid form to the API', async () => {
    const onComplete = jest.fn();
    renderComponent({ onComplete });
    const emailAddressInput = await screen.findByLabelText(/email address/i);
    userEvent.clear(emailAddressInput);
    userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
    userEvent.type(screen.getByLabelText(/confirm password/i), 'Superman1938');
    userEvent.click(screen.getByRole('button', { name: /update email/i }));
    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    await waitFor(() =>
      expect(onComplete).toBeCalledWith(expect.objectContaining({ email: 'clarkkent@dailybugle.com' }))
    );
  });

  describe('shows an error on submission', () => {
    it('with an empty email field', async () => {
      renderComponent();
      userEvent.clear(await screen.findByLabelText(/email address/i));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/confirm password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update email/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/enter an email address/i);
    });

    it('when the email is missing an @', async () => {
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.clear(emailAddressInput);
      userEvent.type(emailAddressInput, 'clarkkent.com'); // no @
      userEvent.type(screen.getByLabelText(/confirm password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update email/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/enter a valid email address/i);
    });

    it('when the email is missing a dot', async () => {
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.clear(emailAddressInput);
      userEvent.type(emailAddressInput, 'clarkkent@dailybugle'); // no dot
      userEvent.type(screen.getByLabelText(/confirm password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update email/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/enter a valid email address/i);
    });

    it("when the email hasn't changed", async () => {
      renderComponent();
      userEvent.type(await screen.findByLabelText(/confirm password/i), 'Superman1938');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: /update email/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /you must enter a new email address to update your library account/i
      );
    });

    it('when the user re-enters their current email', async () => {
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.clear(emailAddressInput);
      userEvent.type(emailAddressInput, mockUser.email);
      userEvent.type(screen.getByLabelText(/confirm password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update email/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /you must enter a new email address to update your library account/i
      );
    });

    it('with an empty password field', async () => {
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.clear(emailAddressInput);
      userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
      userEvent.click(screen.getByRole('button', { name: /update email/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/enter your password/i);
    });
  });

  describe('shows an error after submission', () => {
    it('when the password is incorrect', async () => {
      server.use(
        rest.put('/api/users/me', (req, res, ctx) => {
          return res(ctx.status(401));
        })
      );
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.clear(emailAddressInput);
      userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
      userEvent.type(screen.getByLabelText(/confirm password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update email/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/incorrect password/i);
    });

    it('when the email address is in use', async () => {
      server.use(
        rest.put('/api/users/me', (req, res, ctx) => {
          return res(ctx.status(409));
        })
      );
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.clear(emailAddressInput);
      userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
      userEvent.type(screen.getByLabelText(/confirm password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update email/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/email address already in use/i);
    });
  });
});
