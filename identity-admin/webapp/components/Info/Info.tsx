import React, { useState } from 'react';
import { useUserInfo } from '../../context/UserInfoContext';
import {
  AccountDetailsList,
  AccountDetailsLabel,
  AccountDetail,
  AccountDetailsValue,
  TitleContainer,
} from './Info.style';
import { User } from '../Icons/User';
import { AccountActions } from '../AccountActions';
import { UserStatus } from './UserStatus';
import { AccountActionStatus, AccountActionState } from './AccountActionStatus';

export function Info(): JSX.Element {
  const { user, isLoading } = useUserInfo();
  const [actionStatus, setActionStatus] = useState<AccountActionState | null>(
    null
  );

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <section>
      <TitleContainer>
        <User height="32" width="32" />
        <h2>
          {user?.firstName} {user?.lastName}
        </h2>
        <AccountActions onComplete={setActionStatus} />
      </TitleContainer>
      <AccountDetailsList>
        <AccountDetail>
          <AccountDetailsLabel>Library card number</AccountDetailsLabel>
          <AccountDetailsValue>{user?.barcode}</AccountDetailsValue>
        </AccountDetail>
        <AccountDetail>
          <AccountDetailsLabel>Patron record number</AccountDetailsLabel>
          <AccountDetailsValue>{user?.userId}</AccountDetailsValue>
        </AccountDetail>
      </AccountDetailsList>
      <UserStatus {...user} />
      {actionStatus && <AccountActionStatus {...actionStatus} />}
    </section>
  );
}
