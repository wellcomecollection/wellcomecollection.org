import React from 'react';
import { useUserInfo } from '../UserInfoContext';
import { BlockAccount } from './BlockAccount';
import { DeleteAccount } from './DeleteAccount';
import { ResendActivationEmail } from './ResendActivationEmail';
import { ResetPassword } from './ResetPassword';
import { ReverseDeleteRequest } from './ReverseDeleteRequest';
import { UnblockAccount } from './UnblockAccount';
import { Container } from './AccountActions.style';

export function AccountActions(): JSX.Element {
  const { user, isLoading } = useUserInfo();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <ResendActivationEmail />
      {user?.locked ? <UnblockAccount /> : <BlockAccount />}
      <DeleteAccount />
      {user?.deleteRequested && <ReverseDeleteRequest />}
      <ResetPassword />
    </Container>
  );
}
