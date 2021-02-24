import React from 'react';
import { DangerButton } from '../../../components/Button';
import { useDeleteAccount } from '../../../hooks/useDeleteAccount';

export function DeleteAccount(): JSX.Element {
  const { deleteAccount } = useDeleteAccount();
  const handleClick = () => deleteAccount();
  return <DangerButton onClick={handleClick}>Delete account</DangerButton>;
}
