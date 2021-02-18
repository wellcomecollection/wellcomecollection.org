import React from 'react';
import { render, screen } from '@testing-library/react';
import { Info } from './Info';
import { UserInfo } from '../../../types/UserInfo';

const defaultProps: UserInfo = {
  firstName: 'Steve',
  lastName: 'Rogers',
  locked: false,
  emailValidated: true,
};

const renderComponent = (props = defaultProps) => render(<Info {...props} />);

describe('Info', () => {
  it('has a second-level heading with the name of the user profile being edited', () => {
    renderComponent();
    const secondaryHeading = screen.getByRole('heading', { level: 2 });
    expect(secondaryHeading).toBeInTheDocument();
    expect(secondaryHeading).toHaveTextContent(
      'Edit user profile: Steve Rogers'
    );
  });

  describe('status', () => {
    it('is not shown by default', () => {
      renderComponent();
      const userStatus = screen.queryByRole('complementary');
      expect(userStatus).not.toBeInTheDocument();
    });

    it('shows that an account has been blocked', () => {
      renderComponent({ ...defaultProps, locked: true });
      const userStatus = screen.getByRole('complementary');
      expect(userStatus).toBeInTheDocument();
      expect(userStatus).toHaveTextContent(/account blocked/i);
    });

    it('shows that an account has requested deletion', () => {
      renderComponent({
        ...defaultProps,
        locked: true,
        deleteRequested: '2021-02-18T12:37:58.305Z',
      });
      const userStatus = screen.getByRole('complementary');
      expect(userStatus).toBeInTheDocument();
      expect(userStatus).toHaveTextContent(/user has requested delete/i);
    });

    it("shows that an account's email is not validated", () => {
      renderComponent({
        ...defaultProps,
        emailValidated: false,
      });
      const userStatus = screen.getByRole('complementary');
      expect(userStatus).toBeInTheDocument();
      expect(userStatus).toHaveTextContent(/waiting activation/i);
    });
  });
});
