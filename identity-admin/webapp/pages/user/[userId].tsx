import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import User from './User';
import { UserInfoProvider } from './UserInfoContext';

function UserPage(): JSX.Element {
  return (
    <UserInfoProvider>
      <User />
    </UserInfoProvider>
  );
}

export default UserPage;
export const getServerSideProps = withPageAuthRequired();
