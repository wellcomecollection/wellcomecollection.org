import React, { useState } from 'react';
import Info2 from '@weco/common/icons/components/Info2';

import { useUserInfo, withUserInfo } from './UserInfoContext';
import { ChangeDetailsModal } from './ChangeDetailsModal';
import { PageWrapper } from '../components/PageWrapper';
import { Title } from '../components/Layout.style';
import {
  Container,
  DetailLabel,
  DetailValue,
  DetailWrapper,
  Section,
  SectionHeading,
  StatusAlert,
  Wrapper,
} from './MyAccount.style';
import { Loading } from './Loading';
import { ChangeEmail } from './ChangeEmail';
import { ChangePassword } from './ChangePassword';
import { DeleteAccount } from './DeleteAccount';
import { UpdateUserSchema } from '../../types/schemas/update-user';
import { useHistory } from 'react-router';

const Detail: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <DetailWrapper>
    <DetailLabel>{label}</DetailLabel>
    {value && <DetailValue>{value}</DetailValue>}
  </DetailWrapper>
);

const AccountStatus: React.FC<React.ComponentProps<typeof StatusAlert>> = ({ type, children }) => {
  return (
    <StatusAlert type={type}>
      <Info2 height="32" width="32" fill="currentColor" />
      {children}
    </StatusAlert>
  );
};

const Profile: React.FC = () => {
  const history = useHistory();
  const { user, isLoading, update } = useUserInfo();
  const [isEmailUpdated, setIsEmailUpdated] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  const logoutOnDeletionRequest = () => {
    history.replace(`/logout?returnTo=${encodeURIComponent('/delete-requested')}`);
  };

  return (
    <PageWrapper>
      <Container>
        <Wrapper>
          <Title>My account</Title>
          {!user?.emailValidated && (
            <AccountStatus type="info">You have not yet validated your email address</AccountStatus>
          )}
          {isEmailUpdated && <AccountStatus type="success">Email updated</AccountStatus>}
          {isPasswordUpdated && <AccountStatus type="success">Password updated</AccountStatus>}
          <Section>
            <SectionHeading>My details</SectionHeading>
            <Detail label="Name" value={`${user?.firstName} ${user?.lastName}`} />
            <Detail label="Library card number" value={user?.barcode} />
            <Detail label="Email address" value={user?.email} />
            <ChangeDetailsModal
              id="change-email"
              buttonText="Change Email"
              onComplete={(newUserInfo?: UpdateUserSchema) => {
                if (newUserInfo) update(newUserInfo);
                setIsEmailUpdated(true);
              }}
            >
              <ChangeEmail />
            </ChangeDetailsModal>
          </Section>

          <Section>
            <SectionHeading>Password</SectionHeading>
            <span>Update your password</span>
            <ChangeDetailsModal
              id="change-password"
              buttonText="Change password"
              onComplete={() => {
                setIsPasswordUpdated(true);
              }}
            >
              <ChangePassword />
            </ChangeDetailsModal>
          </Section>

          <Section>
            <SectionHeading>Delete library account</SectionHeading>
            <span>Request a deletion of your account</span>
            <ChangeDetailsModal
              id="delete-account"
              buttonText="Request deletion"
              isDangerous
              onComplete={logoutOnDeletionRequest}
            >
              <DeleteAccount />
            </ChangeDetailsModal>
          </Section>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
};

export const MyAccount = withUserInfo(Profile);
