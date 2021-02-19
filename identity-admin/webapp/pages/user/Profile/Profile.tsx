import React from 'react';
import { useUserInfo } from '../UserInfoContext';

export function Profile(): JSX.Element {
  const { user, isLoading } = useUserInfo();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h3>Library card number</h3>
      <p>{user?.barcode}</p>
      <h3>Patron record number</h3>
      <p>{user?.patronId}</p>
    </>
  );
}
