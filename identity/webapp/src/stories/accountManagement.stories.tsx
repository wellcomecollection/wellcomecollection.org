import React from 'react';
import { AdminRegistration } from '../frontend/AccountAdmin/AdminRegistration';
import { AdminAccountCreated } from '../frontend/AccountAdmin/AdminAccountCreated';
import { AdminEditUser } from '../frontend/AccountAdmin/AdminEditUser';
import { AdminProfileForm } from '../frontend/AccountAdmin/AdminProfileForm';
import { AdminAccountActions } from '../frontend/AccountAdmin/AdminAccountActions';

import { withKnobs, text } from '@storybook/addon-knobs';

export default { title: 'Admin Account Management', decorators: [withKnobs] };

export const AdminAccountRegistration: React.FC = () => {
  return <AdminRegistration />;
};

export const AdminAccountCreatedUI: React.FC = () => {
  return <AdminAccountCreated createAnother={() => console.log('Create Another Clicked')} />;
};

export const AdminEditUserProfile: React.FC = () => {
  return (
    <AdminEditUser
      existingTitle={text('Title', 'Lord')}
      existingFirstName={text('First Name', 'Samuel')}
      existingLastName={text('Surname', 'Beckett')}
      existingEmail={text('email', 'Becketts@provider.com')}
      existingPatronType={text('Patron Type', 'Patron Type')}
      existingGeographicArea={text('Geographic Area', 'UK')}
      existingSourceLocation={text('Source Location', 'Some Source')}
      existingInterest={text('Existing Intrest', 'Books')}
      existingUserCategory={text('User Category', 'Some user category')}
    />
  );
};

export const AdminEditProfileFormUI: React.FC = () => {
  return (
    <AdminProfileForm
      existingTitle={text('Title', 'Lord')}
      existingFirstName={text('First Name', 'Samuel')}
      existingLastName={text('Surname', 'Beckett')}
      existingEmail={text('email', 'Becketts@provider.com')}
      existingPatronType={text('Patron Type', 'Patron Type')}
      existingGeographicArea={text('Geographic Area', 'UK')}
      existingSourceLocation={text('Source Location', 'Some Source')}
      existingInterest={text('Existing Intrest', 'Books')}
      existingUserCategory={text('User Category', 'Some user category')}
    />
  );
};

export const AdminAccountActionsUI: React.FC = () => {
  return <AdminAccountActions />;
};
