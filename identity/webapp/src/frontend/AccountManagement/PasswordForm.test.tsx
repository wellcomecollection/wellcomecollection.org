import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../test-utils';
import { PasswordForm } from './PasswordForm';

const renderComponent = () => render(<PasswordForm />);

describe('PasswordForm', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText(/change your password using the form below/i)).toBeInTheDocument();
  });

  it('allows the user to enter their current password', () => {
    renderComponent();
    const currentPasswordInput = screen.getByLabelText(/current password/i);
    userEvent.type(currentPasswordInput, 'dolphins');
    expect(currentPasswordInput).toHaveValue('dolphins');
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

  it('warns the user when the new password is invalid', () => {
    const getAlert = () =>
      screen.queryByText(/the password you have entered does not meet the password policy/i, {
        selector: 'div[role=alert]',
      });

    renderComponent();
    expect(getAlert()).not.toBeInTheDocument();

    const newPasswordInput = screen.getByLabelText(/^new password/i);

    userEvent.type(newPasswordInput, 'RedCat4'); // too short
    expect(getAlert()).toBeInTheDocument();

    userEvent.clear(newPasswordInput);
    userEvent.type(newPasswordInput, 'redpanda4'); // no capital
    expect(getAlert()).toBeInTheDocument();

    userEvent.clear(newPasswordInput);
    userEvent.type(newPasswordInput, 'REDPANDA4'); // no lowercase
    expect(getAlert()).toBeInTheDocument();

    userEvent.clear(newPasswordInput);
    userEvent.type(newPasswordInput, 'RedPanda'); // no number
    expect(getAlert()).toBeInTheDocument();

    userEvent.clear(newPasswordInput);
    userEvent.type(newPasswordInput, 'RedPanda4'); // valid password
    expect(getAlert()).not.toBeInTheDocument();
  });

  it.todo('warns the user when the new password does not match the confirmation');

  it.todo('only allows the password to be updated when all three fields are complete and valid');
});
