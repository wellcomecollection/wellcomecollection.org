import React from 'react';
import { useUserInfo, withUserInfo } from './UserInfoContext';
import { ChangeDetailsModal } from './ChangeDetailsModal';

const Loading: React.FC = () => (
  <label>
    Loading…
    <progress></progress>
  </label>
);

const ChangeEmail = () => (
  <div>
    <h2>Change email</h2>
  </div>
);

const ChangePassword = () => (
  <div>
    <h2>Change password</h2>
  </div>
);

const DeleteAccount = () => (
  <div>
    <h2>Delete this account</h2>
  </div>
);

const Profile: React.FC = () => {
  const { user, isLoading } = useUserInfo();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <h1>My account</h1>
      <dl>
        <dt>Name</dt>
        <dd>
          {user?.firstName} {user?.lastName}
        </dd>
        <dt>Library card number</dt>
        <dd>{user?.barcode}</dd>
        <dt>Email address</dt>
        <dd>{user?.email}</dd>
        <dt>
          <ChangeDetailsModal id="change-email" buttonText="Update Email" content={ChangeEmail} />
        </dt>
        <dt>Password</dt>
        <dd>********</dd>
        <dt>
          <ChangeDetailsModal id="change-password" buttonText="Update password" content={ChangePassword} />
        </dt>
        <dt>Delete this account</dt>
        <dt>
          <ChangeDetailsModal id="delete-account" buttonText="Request deletion" content={DeleteAccount} />
        </dt>
      </dl>
    </>
  );
};

export const MyAccount = withUserInfo(Profile);
