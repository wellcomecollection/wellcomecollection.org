import React from 'react';
import { Registration } from '../frontend/Registration/Registration';
import { AccountCreated } from '../frontend/Registration/AccountCreated';
import { AccountValidated } from '../frontend/Registration/AccountValidated';
import { ErrorMessage } from '../frontend/Shared/ErrorMessage';

export default { title: 'Registration' };

export const RegistrationUI: React.FC = () => {
  return <Registration />;
};

export const AccountCreatedUI: React.FC = () => {
  return <AccountCreated />;
};

export const AccountValidatedUI: React.FC = () => {
  return <AccountValidated />;
};

export const ErrorMessageUI: React.FC = () => {
  return (
    <ErrorMessage>
      This account already exists. You can try to <a href="TBC">{''}login</a>
    </ErrorMessage>
  );
};
