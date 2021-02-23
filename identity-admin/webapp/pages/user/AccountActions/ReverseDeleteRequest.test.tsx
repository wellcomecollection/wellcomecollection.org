import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ReverseDeleteRequest } from './ReverseDeleteRequest';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: { userId: '3141592' },
    };
  },
}));

const renderComponent = () => render(<ReverseDeleteRequest />);

describe('ReverseDeletionRequest', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: /reverse user's deletion request/i })
    ).toBeInTheDocument();
  });

  it("requests the reset of a user's password", async () => {
    renderComponent();
    userEvent.click(
      screen.getByRole('button', { name: /reverse user's deletion request/i })
    );

    await waitFor(() => {
      expect(fetch).toBeCalledWith('/api/reverse-delete-request/3141592', {
        method: 'put',
      });
    });
  });
});
