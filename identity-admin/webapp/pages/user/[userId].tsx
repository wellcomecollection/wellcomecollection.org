import React from 'react';
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
