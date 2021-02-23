import React from 'react';
import { useUserInfo } from '../UserInfoContext';

export function AccountActions(): JSX.Element {
  const { user } = useUserInfo();

  return (
    <>
      {user && (
        <>
          <button>Resend activation email</button>
          {user.locked ? (
            <button>Unblock online account</button>
          ) : (
            <button>Block online account</button>
          )}
          <button>Delete account</button>
          {user.deleteRequested && (
            <button>Reverse user&apos;s deletion request</button>
          )}
          <button>Reset password</button>
        </>
      )}
    </>
  );
}
