import React from 'react';

type AccountActionButtonProps = {
  label: string;
  onClick: () => Promise<void>;
  onSuccess: () => void;
  onFailure: () => void;
};

export function AccountAction({
  label,
  onClick,
  onSuccess,
  onFailure,
}: AccountActionButtonProps): JSX.Element {
  const handleClick = () =>
    onClick()
      .then(onSuccess)
      .catch(onFailure);
  return <li onClick={handleClick}>{label}</li>;
}
