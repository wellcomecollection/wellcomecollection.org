import React from 'react';
import { Button } from '../Button';

type AccountActionButtonProps = {
  label: string;
  onClick: () => Promise<void>;
  onSuccess: () => void;
  onFailure: () => void;
};

export function AccountActionButton({
  label,
  onClick,
  onSuccess,
  onFailure,
}: AccountActionButtonProps): JSX.Element {
  const handleClick = () =>
    onClick()
      .then(onSuccess)
      .catch(onFailure);
  return <Button onClick={handleClick}>{label}</Button>;
}
