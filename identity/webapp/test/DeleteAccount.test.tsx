import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { ThemeProvider } from 'styled-components';

import theme from '@weco/common/views/themes/default';
import { ChangeDetailsModalContentProps } from '@weco/identity/views/components/ChangeDetailsModal';
import DeleteAccount from '@weco/identity/views/pages/index.DeleteAccount';

import { server } from './mocks/server';

const defaultProps: ChangeDetailsModalContentProps = {
  onComplete: () => null,
  onCancel: () => null,
  isActive: true,
  setIsModalLoading: () => null,
};

const renderComponent = (props: Partial<ChangeDetailsModalContentProps> = {}) =>
  render(
    <ThemeProvider theme={theme}>
      <DeleteAccount {...defaultProps} {...props} />
    </ThemeProvider>
  );

describe('DeleteAccount', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: /yes, delete my account/i })
    ).toBeInTheDocument();
  });

  it('allows the user to enter their password', async () => {
    renderComponent();
    const currentPasswordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(currentPasswordInput, 'hunter2');
    await expect(currentPasswordInput).toHaveValue('hunter2');
  });

  it('allows the user to request account deletion after confirming their password', async () => {
    const onComplete = jest.fn();
    renderComponent({ onComplete });

    await userEvent.type(screen.getByLabelText(/^password$/i), 'hunter2');
    await userEvent.click(
      screen.getByRole('button', { name: /yes, delete my account/i })
    );

    await waitFor(() => expect(onComplete).toBeCalled());
  });

  it('allows the user to cancel the operation', async () => {
    const onCancel = jest.fn();
    renderComponent({ onCancel });

    await userEvent.click(
      screen.getByRole('link', {
        name: /no, go back to my account/i,
      })
    );

    expect(onCancel).toHaveBeenCalled();
  });

  it('resets when modal closes', async () => {
    const { rerender } = renderComponent();
    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, 'hunter2');

    rerender(
      <ThemeProvider theme={theme}>
        <DeleteAccount {...defaultProps} isActive={false} />
      </ThemeProvider>
    );
    rerender(
      <ThemeProvider theme={theme}>
        <DeleteAccount {...defaultProps} isActive={true} />
      </ThemeProvider>
    );

    await expect(passwordInput).toHaveValue('');
  });

  describe('shows an error on submission', () => {
    it('with an empty current password field', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      userEvent.click(
        screen.getByRole('button', { name: /yes, delete my account/i })
      );

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /enter your current password/i
      );
    });
  });

  describe('shows an error after submission', () => {
    it('with an incorrect current password', async () => {
      server.use(
        rest.put('/account/api/users/me/deletion-request', (req, res, ctx) => {
          return res(ctx.status(401));
        })
      );
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await userEvent.type(screen.getByLabelText(/^password$/i), 'hunter2');
      await userEvent.click(
        screen.getByRole('button', { name: /yes, delete my account/i })
      );

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /incorrect password/i
      );
    });

    it('when the users account is brute force restricted', async () => {
      server.use(
        rest.put('/account/api/users/me/deletion-request', (req, res, ctx) => {
          return res(ctx.status(429));
        })
      );
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await userEvent.type(screen.getByLabelText(/^password$/i), 'hunter2');
      await userEvent.click(
        screen.getByRole('button', { name: /yes, delete my account/i })
      );

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /your account has been blocked/i
      );
    });

    it('when another error occurs', async () => {
      server.use(
        rest.put('/account/api/users/me/deletion-request', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await userEvent.type(screen.getByLabelText(/^password$/i), 'hunter2');
      await userEvent.click(
        screen.getByRole('button', { name: /yes, delete my account/i })
      );

      expect(await screen.findByRole('alert')).toHaveTextContent(
        /an unknown error occurred/i
      );
    });
  });
});
