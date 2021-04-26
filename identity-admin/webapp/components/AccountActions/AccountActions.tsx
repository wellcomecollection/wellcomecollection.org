import React, { useRef } from 'react';
import { useUserInfo } from '../../context/UserInfoContext';
import { DeleteAccount } from './DeleteAccount';
import { AccountAction } from './AccountAction';
import { useResendActivationEmail } from '../../hooks/useResendActivationEmail';
import { useResetPassword } from '../../hooks/useResetPassword';
import { useBlockAccount } from '../../hooks/useBlockAccount';
import { useUnblockAccount } from '../../hooks/useUnblockAccount';
import { useReverseDeleteRequest } from '../../hooks/useReverseDeleteRequest';
import { DropdownMenu } from './DropdownMenu';
import { AccountActionState } from '../Info/AccountActionStatus';

type AccountActionsProps = {
  onComplete: (actionState: AccountActionState) => void;
};

export function AccountActions({
  onComplete,
}: AccountActionsProps): JSX.Element {
  const { user, isLoading } = useUserInfo();
  const { resendActivationEmail } = useResendActivationEmail();
  const { resetPassword } = useResetPassword();
  const { blockAccount } = useBlockAccount();
  const { unblockAccount } = useUnblockAccount();
  const { reverseDeleteRequest } = useReverseDeleteRequest();
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const handleSuccess = (message: string) => {
    onComplete({ isSuccess: true, message });
  };

  const handleFailure = (message: string) => {
    onComplete({ isSuccess: false, message });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <DropdownMenu deleteModalRef={deleteModalRef}>
      {close => {
        const handleClickThenClose = (
          onClick: () => Promise<void>
        ) => async () => {
          await onClick().then(close);
        };
        return (
          <ul>
            {!user?.emailValidated && (
              <AccountAction
                label="Resend activation email"
                onClick={handleClickThenClose(resendActivationEmail)}
                onSuccess={() => handleSuccess('Activation email resent')}
                onFailure={() =>
                  handleFailure('Failed to send activation email')
                }
              />
            )}
            {user?.locked ? (
              <AccountAction
                label="Unblock online account"
                onClick={handleClickThenClose(unblockAccount)}
                onSuccess={() => {
                  user.locked = false;
                  handleSuccess('User has been unblocked');
                }}
                onFailure={() => handleFailure('Failed to unblock user')}
              />
            ) : (
              <AccountAction
                label="Block online account"
                onClick={handleClickThenClose(blockAccount)}
                onSuccess={() => {
                  user && (user.locked = true);
                  handleSuccess('User has been blocked');
                }}
                onFailure={() => handleFailure('Failed to block user')}
              />
            )}
            {user?.deleteRequested && (
              <AccountAction
                label="Reverse user's deletion request"
                onClick={handleClickThenClose(reverseDeleteRequest)}
                onSuccess={() => handleSuccess('Delete request reversed')}
                onFailure={() =>
                  handleFailure('Failed to reverse delete request')
                }
              />
            )}
            <AccountAction
              label="Reset password"
              onClick={handleClickThenClose(resetPassword)}
              onSuccess={() => handleSuccess('Password reset')}
              onFailure={() => handleFailure('Failed to reset password')}
            />
            <hr />
            {user && (
              <DeleteAccount userId={user.userId} modalRef={deleteModalRef} />
            )}
          </ul>
        );
      }}
    </DropdownMenu>
  );
}
