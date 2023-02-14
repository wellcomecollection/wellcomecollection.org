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
  isActive: true,
  setIsModalLoading: () => null,
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
    expect(
      screen.getByRole('heading', { name: /change password/i })
    ).toBeInTheDocument();
  });

  it('allows the user to enter their current password', () => {
    renderComponent();
    const currentPasswordInput = screen.getByLabelText(/current password/i);
    userEvent.type(currentPasswordInput, 'hunter2');
    expect(currentPasswordInput).toHaveValue('hunter2');
  });

  it('allows the user to enter a new password', () => {
    renderComponent();
    const newPasswordInput = screen.getByLabelText(/^create new password/i);
    userEvent.type(newPasswordInput, 'hunter2');
    expect(newPasswordInput).toHaveValue('hunter2');
  });

  it('allows the user to confirm the new password', () => {
    renderComponent();
    const confirmPasswordInput = screen.getByLabelText(
      /re-enter new password/i
    );
    userEvent.type(confirmPasswordInput, 'hunter2');
    expect(confirmPasswordInput).toHaveValue('hunter2');
  });

  it('submits a complete and valid form to the API', async () => {
    const onComplete = jest.fn();
    renderComponent({ onComplete });
    userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
    userEvent.type(
      screen.getByLabelText(/^create new password/i),
      'Superman1938'
    );
    userEvent.type(
      screen.getByLabelText(/re-enter new password/i),
      'Superman1938'
    );
    userEvent.click(screen.getByRole('button', { name: /update password/i }));
    await waitFor(() => expect(onComplete).toBeCalled());
  });

  it('resets when modal closes', async () => {
    const { rerender } = renderComponent();
    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/^create new password/i);
    const confirmPasswordInput = screen.getByLabelText(
      /re-enter new password/i
    );
    userEvent.type(currentPasswordInput, 'hunter2');
    userEvent.type(newPasswordInput, 'Superman1938');
    userEvent.type(confirmPasswordInput, 'Superman1938');
    rerender(
      <ThemeProvider theme={theme}>
        <ChangePassword {...defaultProps} isActive={false} />
      </ThemeProvider>
    );
    rerender(
      <ThemeProvider theme={theme}>
        <ChangePassword {...defaultProps} isActive={true} />
      </ThemeProvider>
    );
    expect(currentPasswordInput).toHaveValue('');
    expect(newPasswordInput).toHaveValue('');
    expect(confirmPasswordInput).toHaveValue('');
  });

  describe('shows an error on submission', () => {
    it('with an empty current password field', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'Superman1938'
      );
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'Superman1938'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /enter your current password/i
      );
    });

    it('with an empty new password field', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'Superman1938'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /enter your new password/i
      );
    });

    it('with an invalid new password field', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'superman'
      );
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'Superman2021'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /enter a valid password/i
      );
    });

    it('with an empty confirmation field', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'Superman1938'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /confirm your new password/i
      );
    });

    it('when the new password is too short', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(screen.getByLabelText(/^create new password/i), 'Supes1');
      userEvent.type(screen.getByLabelText(/re-enter new password/i), 'Supes1');
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /enter a valid password/i
      );
    });

    it('when the new password is missing a capital letter', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'superman1'
      );
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'superman1'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /enter a valid password/i
      );
    });

    it('when the new password is missing a small letter', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'SUPERMAN1'
      );
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'SUPERMAN1'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /enter a valid password/i
      );
    });

    it('when the new password is missing a number', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'Superman'
      );
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'Superman'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /enter a valid password/i
      );
    });

    it('when the new password does not match the confirmation', async () => {
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'Superman1938'
      );
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'Superman2021'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /passwords do not match/i
      );
    });
  });

  describe('shows an error after submission', () => {
    it('when the current password is incorrect', async () => {
      server.use(
        rest.put('/account/api/users/me/password', (req, res, ctx) => {
          return res.once(ctx.status(401));
        })
      );
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'Superman1938'
      );
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'Superman1938'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /incorrect password/i
      );
    });

    it('when the users account is brute force restricted', async () => {
      server.use(
        rest.put('/account/api/users/me/password', (req, res, ctx) => {
          return res.once(ctx.status(429));
        })
      );
      renderComponent();

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'Superman1938'
      );
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'Superman1938'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /your account has been blocked/i
      );
    });

    it('when the new password does not meet the Auth0 policy requirements', async () => {
      server.use(
        rest.put('/account/api/users/me/password', (req, res, ctx) => {
          return res.once(ctx.status(422));
        })
      );
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'Superman1938'
      );
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'Superman1938'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /password does not meet the policy/i
      );
    });

    it('when another error occurs', async () => {
      server.use(
        rest.put('/account/api/users/me/password', (req, res, ctx) => {
          return res.once(ctx.status(500));
        })
      );
      renderComponent();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText(/current password/i), 'hunter2');
      userEvent.type(
        screen.getByLabelText(/^create new password/i),
        'Superman1938'
      );
      userEvent.type(
        screen.getByLabelText(/re-enter new password/i),
        'Superman1938'
      );
      userEvent.click(screen.getByRole('button', { name: /update password/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'There is an issue with this library account password. To resolve this, please contact Library Enquiries (library@wellcomecollection.org).'
      );
    });
  });
});
