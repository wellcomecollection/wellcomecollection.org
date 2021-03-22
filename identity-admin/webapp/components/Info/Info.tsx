import React from 'react';
import { UserInfo } from '../../types/UserInfo';
import { useUserInfo } from '../../context/UserInfoContext';
import { StatusBox } from './Info.style';

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
    <>
      <h2>
        Edit user profile: {user?.firstName} {user?.lastName}
      </h2>
      <UserStatus {...user} />
      <h3>Library card number</h3>
      <p>{user?.barcode}</p>
      <h3>Patron record number</h3>
      <p>{user?.patronId}</p>
    </>
  );
}
