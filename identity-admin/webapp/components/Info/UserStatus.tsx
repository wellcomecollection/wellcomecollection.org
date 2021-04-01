import React from 'react';
import { UserInfo } from '../../types/UserInfo';
import { StatusBox } from './Info.style';

export function UserStatus(props: Partial<UserInfo>): JSX.Element | null {
  if (props.deleteRequested) {
    return <StatusBox type="info">User has requested delete</StatusBox>;
  }
  if (props.locked) {
    return <StatusBox type="info">Account blocked</StatusBox>;
  }
  if (!props.emailValidated) {
    return <StatusBox type="info">Waiting activation</StatusBox>;
  }
  return null;
}
