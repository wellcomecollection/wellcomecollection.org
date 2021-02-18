import React from 'react';
import { UserInfo } from '../../../types/UserInfo';

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

export function Info(props: UserInfo): JSX.Element {
  const { firstName, lastName } = props;
  return (
    <>
      <h2>
        Edit user profile: {firstName} {lastName}
      </h2>
      <UserStatus {...props} />
    </>
  );
}
