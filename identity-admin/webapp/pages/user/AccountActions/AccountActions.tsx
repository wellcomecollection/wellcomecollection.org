import React, { useState } from 'react';
import { useUserInfo } from '../UserInfoContext';
import { DeleteAccount } from './DeleteAccount';
import { ReverseDeleteRequest } from './ReverseDeleteRequest';
import { Container } from './AccountActions.style';
import { useResendActivationEmail } from '../../../hooks/useResendActivationEmail';
import { AccountActionButton } from './AccountActionButton';
import { useResetPassword } from '../../../hooks/useResetPassword';
import { useBlockAccount } from '../../../hooks/useBlockAccount';
import { useUnblockAccount } from '../../../hooks/useUnblockAccount';

type AccountActionState = {
  isSuccess: boolean;
  message?: string;
};

export function AccountActions(): JSX.Element {
  const { user, isLoading } = useUserInfo();
  const { resendActivationEmail } = useResendActivationEmail();
  const { resetPassword } = useResetPassword();
  const { blockAccount } = useBlockAccount();
  const { unblockAccount } = useUnblockAccount();
  const [status, setStatus] = useState<AccountActionState>({
    isSuccess: false,
  });

  const handleSuccess = (message: string) => {
    setStatus({ isSuccess: true, message });
  };

  const handleFailure = (message: string) => {
    setStatus({ isSuccess: false, message });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      {status.message && <div role="alert">{status.message}</div>}
      <AccountActionButton
        label="Resend activation email"
        onClick={resendActivationEmail}
        onSuccess={() => handleSuccess('Activation email resent')}
        onFailure={() => handleFailure('Failed to send activation email')}
      />
      {user?.locked ? (
        <AccountActionButton
          label="Unblock online account"
          onClick={unblockAccount}
          onSuccess={() => handleSuccess('User has been unblocked')}
          onFailure={() => handleFailure('Failed to unblock user')}
        />
      ) : (
        <AccountActionButton
          label="Block online account"
          onClick={blockAccount}
          onSuccess={() => handleSuccess('User has been blocked')}
          onFailure={() => handleFailure('Failed to block user')}
        />
      )}
      <DeleteAccount />
      {user?.deleteRequested && <ReverseDeleteRequest />}
      <AccountActionButton
        label="Reset password"
        onClick={resetPassword}
        onSuccess={() => handleSuccess('Password reset')}
        onFailure={() => handleFailure('Failed to reset password')}
      />
    </Container>
  );
}
