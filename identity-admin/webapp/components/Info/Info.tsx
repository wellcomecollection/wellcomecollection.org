import React from 'react';
import { UserInfo } from '../../types/UserInfo';
import { useUserInfo } from '../../context/UserInfoContext';
import {
  AccountDetailsList,
  AccountDetailsLabel,
  StatusBox,
  AccountDetail,
  AccountDetailsValue,
  TitleContainer,
} from './Info.style';
import { User } from '../Icons/User';

function UserStatus(props: Partial<UserInfo>) {
  if (props.deleteRequested) {
    return <StatusBox>User has requested delete</StatusBox>;
  }
  if (props.locked) {
    return <StatusBox>Account blocked</StatusBox>;
  }
  if (!props.emailValidated) {
    return <StatusBox>Waiting activation</StatusBox>;
  }
  return null;
}

export function Info(): JSX.Element {
  const { user, isLoading } = useUserInfo();

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <section>
      <TitleContainer>
        <User height="32" width="32" />
        <h2>
          {user?.firstName} {user?.lastName}
        </h2>
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
    </section>
  );
}
