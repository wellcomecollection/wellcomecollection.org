import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EditProfile } from '../../components/EditProfile';
import { UserInfoProvider } from '../../context/UserInfoContext';

function UserPage(): JSX.Element {
  return (
    <UserInfoProvider>
      <EditProfile />
    </UserInfoProvider>
  );
}

export default UserPage;
export const getServerSideProps = withPageAuthRequired();
