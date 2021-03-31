import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangePassword } from './ChangePassword';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { server } from '../mocks/server';
import { rest } from 'msw';

const defaultProps: ChangeDetailsModalContentProps = {
  onComplete: () => null,
  onCancel: () => null,
};

const renderComponent = (props: Partial<ChangeDetailsModalContentProps> = {}) =>
  render(
    <ThemeProvider theme={theme}>
      <ChangePassword {...defaultProps} {...props} />
    </ThemeProvider>
  );

describe('ChangePassword', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /change password/i })).toBeInTheDocument();
  });

  it('allows the user to enter their current password', () => {
    renderComponent();
    const currentPasswordInput = screen.getByLabelText(/current password/i);
    userEvent.type(currentPasswordInput, 'hunter2');
    expect(currentPasswordInput).toHaveValue('hunter2');
  });

  it('allows the user to enter a new password', () => {
    renderComponent();
    const newPasswordInput = screen.getByLabelText(/^new password/i);
    userEvent.type(newPasswordInput, 'hunter2');
    expect(newPasswordInput).toHaveValue('hunter2');
  });

  it('allows the user to confirm the new password', () => {
    renderComponent();
    const confirmPasswordInput = screen.getByLabelText(/retype new password/i);
    userEvent.type(confirmPasswordInput, 'hunter2');
    expect(confirmPasswordInput).toHaveValue('hunter2');
  });

  it('submits a complete and valid form to the API', async () => {
    const onComplete = jest.fn();
    renderComponent({ onComplete });
    userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
    userEvent.type(screen.getByLabelText(/^new password/i), 'Superman1938');
    userEvent.type(screen.getByLabelText(/retype new password/i), 'Superman1938');
    userEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(onComplete).toBeCalled());
  });

  describe('shows an error on submission', () => {
    it('with an empty current password field', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/^new password/i), 'Superman1938');
      userEvent.type(screen.getByLabelText(/retype new password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/enter your current password/i);
    });

    it('with an empty new password field', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(screen.getByLabelText(/retype new password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      const alerts = await screen.findAllByRole('alert');
      expect(alerts[0]).toHaveTextContent(/enter your new password/i);
      expect(alerts[1]).toHaveTextContent(/passwords do not match/i);
    });

    it('with an empty confirmation field', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(screen.getByLabelText(/^new password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/confirm your new password/i);
    });

    it('when the new password is too short', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(screen.getByLabelText(/^new password/i), 'Supes1');
      userEvent.type(screen.getByLabelText(/retype new password/i), 'Supes1');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/enter a valid password/i);
    });

    it('when the new password is missing a capital letter', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(screen.getByLabelText(/^new password/i), 'superman1');
      userEvent.type(screen.getByLabelText(/retype new password/i), 'superman1');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/enter a valid password/i);
    });

    it('when the new password is missing a small letter', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(screen.getByLabelText(/^new password/i), 'SUPERMAN1');
      userEvent.type(screen.getByLabelText(/retype new password/i), 'SUPERMAN1');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/enter a valid password/i);
    });

    it('when the new password is missing a number', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(screen.getByLabelText(/^new password/i), 'Superman');
      userEvent.type(screen.getByLabelText(/retype new password/i), 'Superman');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/enter a valid password/i);
    });

    it('when the new password does not match the confirmation', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(screen.getByLabelText(/^new password/i), 'Superman1938');
      userEvent.type(screen.getByLabelText(/retype new password/i), 'Superman2021');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/passwords do not match/i);
    });
  });

  describe('shows an error after submission', () => {
    it('when the current password is incorrect', async () => {
      server.use(
        rest.put('/api/users/me/password', (req, res, ctx) => {
          return res(ctx.status(401));
        })
      );
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(screen.getByLabelText(/^new password/i), 'Superman1938');
      userEvent.type(screen.getByLabelText(/retype new password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/incorrect password/i);
    });

    it('when the new password does not meet the Auth0 policy requirements', async () => {
      server.use(
        rest.put('/api/users/me/password', (req, res, ctx) => {
          return res(ctx.status(422));
        })
      );
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(screen.getByLabelText(/^new password/i), 'Superman1938');
      userEvent.type(screen.getByLabelText(/retype new password/i), 'Superman1938');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(/password does not meet the policy/i);
    });
  });
});
