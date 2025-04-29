import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { ThemeProvider } from 'styled-components';

import { mockUser } from '@weco/common/test/fixtures/identity/user';
import UserProvider from '@weco/common/views/components/UserProvider';
import theme from '@weco/common/views/themes/default';
import { server } from '@weco/identity/src/frontend/mocks/server';

import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { ChangeEmail } from './ChangeEmail';

const defaultProps: ChangeDetailsModalContentProps = {
  onComplete: () => null,
  onCancel: () => null,
  isActive: true,
  setIsModalLoading: () => null,
};

const renderComponent = (props: Partial<ChangeDetailsModalContentProps> = {}) =>
  render(
    <ThemeProvider theme={theme}>
      <UserProvider>
        <ChangeEmail {...defaultProps} {...props} />
      </UserProvider>
    </ThemeProvider>
  );

describe('ChangeEmail', () => {
  it('renders correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: /change email/i })
      ).toBeInTheDocument();
    });
  });

  it('displays an empty text input for the new email', async () => {
    renderComponent();
    await expect(await screen.findByLabelText(/email address/i)).toHaveValue(
      ''
    );
  });

  it('allows the user to enter an email address', async () => {
    renderComponent();
    const emailAddressInput = await screen.findByLabelText(/email address/i);
    await act(async () => {
      await userEvent.clear(emailAddressInput);
      await userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
    });
    await waitFor(() =>
      expect(emailAddressInput).toHaveValue('clarkkent@dailybugle.com')
    );
  });

  it('allows the user to confirm their password', async () => {
    renderComponent();
    const confirmPasswordInput =
      await screen.findByLabelText(/confirm password/i);
    await act(async () => userEvent.type(confirmPasswordInput, 'Superman1938'));
    await waitFor(() =>
      expect(confirmPasswordInput).toHaveValue('Superman1938')
    );
  });

  it('submits a complete and valid form to the API', async () => {
    const onComplete = jest.fn();
    renderComponent({ onComplete });
    const emailAddressInput = await screen.findByLabelText(/email address/i);
    await act(async () => {
      await userEvent.clear(emailAddressInput);
      await userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
      await userEvent.type(
        screen.getByLabelText(/confirm password/i),
        'Superman1938'
      );
      await userEvent.click(
        screen.getByRole('button', { name: /update email/i })
      );
    });
    await waitFor(() =>
      expect(onComplete).toBeCalledWith(
        expect.objectContaining({
          ...mockUser,
          email: 'clarkkent@dailybugle.com',
        })
      )
    );
  });

  it('resets when modal closes', async () => {
    const { rerender } = renderComponent();
    const emailAddressInput = await screen.findByLabelText(/email address/i);
    await act(async () => {
      await userEvent.clear(emailAddressInput);
      await userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
    });
    rerender(
      <ThemeProvider theme={theme}>
        <UserProvider>
          <ChangeEmail {...defaultProps} isActive={false} />
        </UserProvider>
      </ThemeProvider>
    );
    rerender(
      <ThemeProvider theme={theme}>
        <UserProvider>
          <ChangeEmail {...defaultProps} isActive={true} />
        </UserProvider>
      </ThemeProvider>
    );
    await expect(emailAddressInput).toHaveValue('');
  });

  describe('shows an error on submission', () => {
    it('with an empty email field', async () => {
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);

      await act(async () => userEvent.clear(emailAddressInput));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          'Superman1938'
        );
        await userEvent.click(
          screen.getByRole('button', { name: /update email/i })
        );
      });

      // Note: this is testing that the browser's native controls are rejecting
      // the empty field, rather than our own alerts.
      expect(emailAddressInput).toBeInvalid();
    });

    it('when the email is missing an @', async () => {
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.clear(emailAddressInput);
        await userEvent.type(emailAddressInput, 'clarkkent.com'); // no @
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          'Superman1938'
        );
        await userEvent.click(
          screen.getByRole('button', { name: /update email/i })
        );
      });

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /Enter an email address in the correct format, like name@example.com/i
      );
    });

    it('when the email is missing a dot', async () => {
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.clear(emailAddressInput);
        await userEvent.type(emailAddressInput, 'clarkkent@dailybugle'); // no dot
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          'Superman1938'
        );
        await userEvent.click(
          screen.getByRole('button', { name: /update email/i })
        );
      });

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /Enter an email address in the correct format, like name@example.com/i
      );
    });

    it("when the email hasn't changed", async () => {
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);

      await act(async () => {
        await userEvent.type(emailAddressInput, mockUser.email);
        await userEvent.type(
          await screen.findByLabelText(/confirm password/i),
          'Superman1938'
        );
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        await userEvent.click(
          screen.getByRole('button', { name: /update email/i })
        );
      });

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /you must enter a new email address to update your library account/i
      );
    });

    it('when the user re-enters their current email', async () => {
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.clear(emailAddressInput);
        await userEvent.type(emailAddressInput, mockUser.email);
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          'Superman1938'
        );
        await userEvent.click(
          screen.getByRole('button', { name: /update email/i })
        );
      });

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /you must enter a new email address to update your library account/i
      );
    });

    it('with an empty password field', async () => {
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.clear(emailAddressInput);
        await userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
        await userEvent.click(
          screen.getByRole('button', { name: /update email/i })
        );
      });

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /enter your password/i
      );
    });
  });

  describe('shows an error after submission', () => {
    it('when the password is incorrect', async () => {
      server.use(
        rest.put('/account/api/users/me', (req, res, ctx) => {
          return res(ctx.status(401));
        })
      );
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      await act(async () => {
        await userEvent.clear(emailAddressInput);
        await userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          'Superman1938'
        );
        await userEvent.click(
          screen.getByRole('button', { name: /update email/i })
        );
      });

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /incorrect password/i
      );
    });

    it('when the users account is brute force restricted', async () => {
      server.use(
        rest.put('/account/api/users/me', (req, res, ctx) => {
          return res(ctx.status(429));
        })
      );
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.clear(emailAddressInput);
        await userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          'Superman1938'
        );
        await userEvent.click(
          screen.getByRole('button', { name: /update email/i })
        );
      });

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /your account has been blocked/i
      );
    });

    it('when the email address is in use', async () => {
      server.use(
        rest.put('/account/api/users/me', (req, res, ctx) => {
          return res(ctx.status(409));
        })
      );
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.clear(emailAddressInput);
        await userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          'Superman1938'
        );
        await userEvent.click(
          screen.getByRole('button', { name: /update email/i })
        );
      });

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /email address already in use/i
      );
    });

    it('when another error occurs', async () => {
      server.use(
        rest.put('/account/api/users/me', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );
      renderComponent();
      const emailAddressInput = await screen.findByLabelText(/email address/i);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.clear(emailAddressInput);
        await userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          'Superman1938'
        );
        await userEvent.click(
          screen.getByRole('button', { name: /update email/i })
        );
      });

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /an unknown error occurred/i
      );
    });
  });
});
