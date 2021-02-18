import React from 'react';
import Link from 'next/link';
import { useUserInfo } from '../../hooks/useUserInfo';
import { Info } from './Info';

function User(): JSX.Element {
  const { userInfo } = useUserInfo();
  return (
    <>
      <h1>
        <Link href="/">Account administration</Link>
      </h1>
      <Info {...userInfo} />
    </>
  );
}

export default User;
