import React from 'react';
import { Button } from '../../../components/Button';
import { useBlockAccount } from '../../../hooks/useBlockAccount';

export function BlockAccount(): JSX.Element {
  const { blockAccount } = useBlockAccount();
  const handleClick = () => blockAccount();
  return <Button onClick={handleClick}>Block online account</Button>;
}
