import React from 'react';
import { useUserInfo } from '../UserInfoContext';
import { BlockAccount } from './BlockAccount';
import { DeleteAccount } from './DeleteAccount';
import { ResendActivationEmail } from './ResendActivationEmail';
import { ResetPassword } from './ResetPassword';

export function AccountActions(): JSX.Element {
  const { user } = useUserInfo();

  return (
    <>
      {user && (
        <>
          <ResendActivationEmail />
          {user.locked ? (
            <button>Unblock online account</button>
          ) : (
            <BlockAccount />
          )}
          <DeleteAccount />
          {user.deleteRequested && (
            <button>Reverse user&apos;s deletion request</button>
          )}
          <ResetPassword />
        </>
      )}
    </>
  );
}
