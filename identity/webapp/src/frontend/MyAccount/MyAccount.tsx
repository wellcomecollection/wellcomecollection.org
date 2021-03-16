import React, { useState } from 'react';
import Info2 from '@weco/common/icons/components/Info2';

import { useUserInfo, withUserInfo } from './UserInfoContext';
import { ChangeDetailsModal } from './ChangeDetailsModal';
import { PageWrapper } from '../components/PageWrapper';
import { Container, Title, Wrapper } from '../components/Layout.style';
import { DetailWrapper, Grid, HorizontalRule, Label, StatusAlert } from './MyAccount.style';
import { Loading } from './Loading';
import { ChangeEmail } from './ChangeEmail';
import { ChangePassword } from './ChangePassword';
import { DeleteAccount } from './DeleteAccount';

const Detail: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <DetailWrapper>
    <Label>{label}</Label>
    {value && <span>{value}</span>}
  </DetailWrapper>
);

const AccountStatus: React.FC = ({ children }) => {
  return (
    <StatusAlert>
      <Info2 height="32" width="32" fill="currentColor" />
      {children}
    </StatusAlert>
  );
};

const Profile: React.FC = () => {
  const { user, isLoading } = useUserInfo();
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageWrapper>
      <Container>
        <Wrapper>
          <Title>My account</Title>
          {updatedEmail && <AccountStatus>Email updated</AccountStatus>}
          {isPasswordUpdated && <AccountStatus>Password updated</AccountStatus>}
          <Grid>
            <Detail label="Name" value={`${user?.firstName} ${user?.lastName}`} />
            <Detail label="Library card number" value={user?.barcode} />
            <Detail label="Email address" value={updatedEmail || user?.email} />
            <ChangeDetailsModal
              id="change-email"
              buttonText="Change Email"
              content={ChangeEmail}
              onSuccess={({ email }) => setUpdatedEmail(email)}
            />
            <Detail label="Password" value="********" />
            <ChangeDetailsModal
              id="change-password"
              buttonText="Change password"
              content={ChangePassword}
              onSuccess={() => setIsPasswordUpdated(true)}
            />
            <HorizontalRule />
            <Detail label="Delete this account" />
            <ChangeDetailsModal id="delete-account" buttonText="Request deletion" isDangerous content={DeleteAccount} />
          </Grid>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
};

export const MyAccount = withUserInfo(Profile);
