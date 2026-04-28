import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import theme from '@weco/common/views/themes/default';
import { accountApiClient } from '@weco/identity/utils/api-client';
import { FetchError } from '@weco/identity/utils/fetch-helpers';
import { ChangeDetailsModalContentProps } from '@weco/identity/views/components/ChangeDetailsModal';
import DeleteAccount from '@weco/identity/views/pages/index.DeleteAccount';

jest.mock('@weco/identity/utils/api-client', () => ({
  accountApiClient: {
    put: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockPut = accountApiClient.put as jest.Mock;

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
  beforeEach(() => {
    mockPut.mockReset();
    mockPut.mockResolvedValue({ status: 200, data: null, statusText: 'OK' });
  });

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

    await waitFor(() => expect(onComplete).toHaveBeenCalled());
  });

  it('allows the user to cancel the operation', async () => {
    const onCancel = jest.fn();
    renderComponent({ onCancel });

    await userEvent.click(
      screen.getByRole('button', { name: /no, go back to my account/i })
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
      const error = new FetchError('Request failed');
      error.response = { status: 401, statusText: 'Unauthorized', data: null };
      mockPut.mockRejectedValueOnce(error);
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
      const error = new FetchError('Request failed');
      error.response = {
        status: 429,
        statusText: 'Too Many Requests',
        data: null,
      };
      mockPut.mockRejectedValueOnce(error);
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
      const error = new FetchError('Request failed');
      error.response = {
        status: 500,
        statusText: 'Internal Server Error',
        data: null,
      };
      mockPut.mockRejectedValueOnce(error);
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
