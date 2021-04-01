import React from 'react';
import { StatusBox } from '../StatusBox';

export type AccountActionState = {
  isSuccess: boolean;
  message: string;
};

export const AccountActionStatus: React.FC<AccountActionState> = ({
  isSuccess,
  message,
}) => {
  return (
    <StatusBox type={isSuccess ? 'success' : 'failure'}>{message}</StatusBox>
  );
};
