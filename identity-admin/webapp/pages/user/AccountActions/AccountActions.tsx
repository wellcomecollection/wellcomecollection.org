import React, { useState } from 'react';
import { useUserInfo } from '../UserInfoContext';
import { BlockAccount } from './BlockAccount';
import { DeleteAccount } from './DeleteAccount';
import { ReverseDeleteRequest } from './ReverseDeleteRequest';
import { UnblockAccount } from './UnblockAccount';
import { Container } from './AccountActions.style';
import { useResendActivationEmail } from '../../../hooks/useResendActivationEmail';
import { AccountActionButton } from './AccountActionButton';
import { useResetPassword } from '../../../hooks/useResetPassword';

type AccountActionState = {
  isSuccess: boolean;
  message?: string;
};

export function AccountActions(): JSX.Element {
  const { user, isLoading } = useUserInfo();
  const { resendActivationEmail } = useResendActivationEmail();
  const { resetPassword } = useResetPassword();
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
      {user?.locked ? <UnblockAccount /> : <BlockAccount />}
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
