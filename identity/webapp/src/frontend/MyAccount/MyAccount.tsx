import React from 'react';
import { useUserInfo, withUserInfo } from './UserInfoContext';
import { ChangeDetailsModal } from './ChangeDetailsModal';
import { PageWrapper } from '../components/PageWrapper';
import { Container, Title, Wrapper } from '../components/Layout.style';
import { DetailWrapper, Grid, HorizontalRule, Label } from './MyAccount.style';
import { ChangeEmail } from './ChangeEmail';
import { Loading } from './Loading';

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

const Detail: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <DetailWrapper>
    <Label>{label}</Label>
    {value && <span>{value}</span>}
  </DetailWrapper>
);

const Profile: React.FC = () => {
  const { user, isLoading } = useUserInfo();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageWrapper>
      <Container>
        <Wrapper>
          <Title>My account</Title>
          <Grid>
            <Detail label="Name" value={`${user?.firstName} ${user?.lastName}`} />
            <Detail label="Library card number" value={user?.barcode} />
            <Detail label="Email address" value={user?.email} />
            <ChangeDetailsModal id="change-email" buttonText="Update Email" content={ChangeEmail} />
            <Detail label="Password" value="********" />
            <ChangeDetailsModal id="change-password" buttonText="Update password" content={ChangePassword} />
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
