import React from 'react';
import { ProfileForm } from '../frontend/AccountManagement/ProfileForm';
import { PasswordForm } from '../frontend/AccountManagement/PasswordForm';
import { DeleteAccount } from '../frontend/AccountManagement/DeleteAccount';

import { withKnobs, text } from '@storybook/addon-knobs';

export default { title: 'Account Admin', decorators: [withKnobs] };

export const ProfileFormUI: React.FC = () => {
  return (
    <ProfileForm
      firstName={text('First Name', 'Samuel')}
      lastName={text('Surname', 'Beckett')}
      email={text('email', 'Becketts@provider.com')}
      barcode={text('Library card number', '123456')}
      onUpdate={() => null}
    />
  );
};

export const PasswordFormUI: React.FC = () => {
  return <PasswordForm />;
};

export const DeleteAccountUI: React.FC = () => {
  return <DeleteAccount onCancel={() => null} />;
};
