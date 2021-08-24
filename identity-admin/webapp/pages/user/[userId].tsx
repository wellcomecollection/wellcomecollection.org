import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EditProfile } from '../../components/EditProfile';
import { AdminUserInfoProvider } from '../../context/AdminUserInfoContext';

function UserPage(): JSX.Element {
  return (
    <AdminUserInfoProvider>
      <EditProfile />
    </AdminUserInfoProvider>
  );
}

export default UserPage;
export const getServerSideProps = withPageAuthRequired();
