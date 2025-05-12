import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { ThemeProvider } from 'styled-components';

import theme from '@weco/common/views/themes/default';
import {
  PasswordInput,
  PasswordInputProps,
} from '@weco/identity/components/PasswordInput/PasswordInput';

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

  it('lets a user enter a password', async () => {
    renderComponent();
    const input = screen.getByLabelText(/^password$/i);

    await userEvent.type(input, 'hunter2');

    await expect(input).toHaveValue('hunter2');
  });

  it('hides the password by default, and can reveal the characters', async () => {
    renderComponent();
    const input = screen.getByLabelText(/^password$/i);
    await expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(
      screen.getByRole('button', { name: /show password/i })
    );
    await expect(input).toHaveAttribute('type', 'text');

    await userEvent.click(
      screen.getByRole('button', { name: /hide password/i })
    );

    await expect(input).toHaveAttribute('type', 'password');
  });
});
