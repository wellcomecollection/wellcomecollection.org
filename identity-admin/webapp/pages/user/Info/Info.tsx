import React from 'react';
import { UserInfo } from '../../../types/UserInfo';
import { useUserInfo } from '../UserInfoContext';

function UserStatus(props: UserInfo) {
  const StatusBox: React.FC<{ children: string }> = ({ children }) => (
    <aside>{children}</aside>
  );
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
  const { data, isLoading } = useUserInfo();

  if (isLoading || !data) {
    return <p>Loading...</p>;
  }

  const { firstName, lastName } = data;

  return (
    <>
      <h2>
        Edit user profile: {firstName} {lastName}
      </h2>
      <UserStatus {...data} />
    </>
  );
}
