import React from 'react';
import { useUserInfo } from '../UserInfoContext';
import { BlockAccount } from './BlockAccount';
import { DeleteAccount } from './DeleteAccount';
import { ResendActivationEmail } from './ResendActivationEmail';
import { ResetPassword } from './ResetPassword';
import { ReverseDeleteRequest } from './ReverseDeleteRequest';
import { UnblockAccount } from './UnblockAccount';

export function AccountActions(): JSX.Element {
  const { user } = useUserInfo();

  return (
    <>
      {user && (
        <>
          <ResendActivationEmail />
          {user.locked ? <UnblockAccount /> : <BlockAccount />}
          <DeleteAccount />
          {user.deleteRequested && <ReverseDeleteRequest />}
          <ResetPassword />
        </>
      )}
    </>
  );
}
