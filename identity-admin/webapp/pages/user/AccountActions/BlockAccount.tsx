import React from 'react';
import { useBlockAccount } from '../../../hooks/useBlockAccount';

export function BlockAccount(): JSX.Element {
  const { blockAccount } = useBlockAccount();
  const handleClick = () => blockAccount();
  return <button onClick={handleClick}>Block online account</button>;
}
