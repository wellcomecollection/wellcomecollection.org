import React from 'react';
import { useUnblockAccount } from '../../../hooks/useUnblockAccount';

export function UnblockAccount(): JSX.Element {
  const { unblockAccount } = useUnblockAccount();
  const handleClick = () => unblockAccount();
  return <button onClick={handleClick}>Unblock online account</button>;
}
