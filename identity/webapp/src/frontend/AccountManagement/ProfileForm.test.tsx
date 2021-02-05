import React from 'react';
import { render, screen } from '../test-utils';
import { ProfileForm } from './ProfileForm';
import { UserInfo } from '../hooks/useUserInfo';

const defaultProps: UserInfo = {
  firstName: 'Bruce',
  lastName: 'Wayne',
  email: 'batman@justiceleague.com',
  barcode: '1234567',
};

const renderComponent = (props = defaultProps) => render(<ProfileForm {...props} />);

describe('ProfileForm', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /change email/i })).toBeInTheDocument();
  });
});
