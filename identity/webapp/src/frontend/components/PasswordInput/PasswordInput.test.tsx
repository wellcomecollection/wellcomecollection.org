import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';

import { PasswordInput, PasswordInputProps } from './PasswordInput';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

const renderComponent = (props: Partial<PasswordInputProps> = {}) => {
  const Form = () => {
    const { control } = useForm<{ password: string }>({
      defaultValues: { password: '' },
    });
    return (
      <ThemeProvider theme={theme}>
        <PasswordInput
          label="password"
          name="password"
          id="password"
          {...props}
          control={control}
        />
      </ThemeProvider>
    );
  };
  render(<Form />);
};

describe('PasswordInput', () => {
  it('renders', () => {
    renderComponent();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it('shows no policy rules by default', () => {
    renderComponent();
    const listItems = screen.queryByRole('listitem');
    expect(listItems).not.toBeInTheDocument();
  });

  it('lets a user enter a password', () => {
    renderComponent();
    const input = screen.getByLabelText(/^password$/i);
    userEvent.type(input, 'hunter2');
    expect(input).toHaveValue('hunter2');
  });

  it('hides the password by default, and can reveal the characters', () => {
    renderComponent();
    const input = screen.getByLabelText(/^password$/i);
    expect(input).toHaveAttribute('type', 'password');
    userEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(input).toHaveAttribute('type', 'text');
    userEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(input).toHaveAttribute('type', 'password');
  });
});
