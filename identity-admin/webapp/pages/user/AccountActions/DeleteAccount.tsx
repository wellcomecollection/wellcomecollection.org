import React from 'react';
import { useDeleteAccount } from '../../../hooks/useDeleteAccount';

export function DeleteAccount(): JSX.Element {
  const { deleteAccount } = useDeleteAccount();
  const handleClick = () => deleteAccount();
  return <button onClick={handleClick}>Delete account</button>;
}
