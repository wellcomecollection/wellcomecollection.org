import React from 'react';
import { UserInfo } from '../../../types/UserInfo';
import { useUserInfo } from '../UserInfoContext';
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>
        Edit user profile: {user?.firstName} {user?.lastName}
      </h2>
      <UserStatus {...user} />
    </>
  );
}
