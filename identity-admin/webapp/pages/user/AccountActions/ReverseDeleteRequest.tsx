import React from 'react';
import { useReverseDeleteRequest } from '../../../hooks/useReverseDeleteRequest';

export function ReverseDeleteRequest(): JSX.Element {
  const { reverseDeleteRequest } = useReverseDeleteRequest();
  const handleClick = () => reverseDeleteRequest();
  return (
    <button onClick={handleClick}>Reverse user&apos;s deletion request</button>
  );
}
