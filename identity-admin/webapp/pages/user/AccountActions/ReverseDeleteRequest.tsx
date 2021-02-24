import React from 'react';
import { Button } from '../../../components/Button';
import { useReverseDeleteRequest } from '../../../hooks/useReverseDeleteRequest';

export function ReverseDeleteRequest(): JSX.Element {
  const { reverseDeleteRequest } = useReverseDeleteRequest();
  const handleClick = () => reverseDeleteRequest();
  return (
    <Button onClick={handleClick}>Reverse user&apos;s deletion request</Button>
  );
}
