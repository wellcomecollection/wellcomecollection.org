import React from 'react';
import { Button } from '../../../components/Button';
import { useUnblockAccount } from '../../../hooks/useUnblockAccount';

export function UnblockAccount(): JSX.Element {
  const { unblockAccount } = useUnblockAccount();
  const handleClick = () => unblockAccount();
  return <Button onClick={handleClick}>Unblock online account</Button>;
}
