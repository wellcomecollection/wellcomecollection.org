import React from 'react';
import { useUserInfo } from '../UserInfoContext';
import { DeleteAccount } from './DeleteAccount';
import { ResendActivationEmail } from './ResendActivationEmail';

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
            <button>Block online account</button>
          )}
          <DeleteAccount />
          {user.deleteRequested && (
            <button>Reverse user&apos;s deletion request</button>
          )}
          <button>Reset password</button>
        </>
      )}
    </>
  );
}
