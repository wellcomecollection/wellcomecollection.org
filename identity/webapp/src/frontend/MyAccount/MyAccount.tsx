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

const Detail: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <DetailWrapper>
    <DetailLabel>{label}</DetailLabel>
    {value && <DetailValue>{value}</DetailValue>}
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
  const { user, isLoading, update } = useUserInfo();
  const [isEmailUpdated, setIsEmailUpdated] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageWrapper>
      <Container>
        <Wrapper>
          <Title>My account</Title>
          {isEmailUpdated && <AccountStatus>Email updated</AccountStatus>}
          {isPasswordUpdated && <AccountStatus>Password updated</AccountStatus>}
          <Section>
            <SectionHeading>My details</SectionHeading>
            <Detail label="Name" value={`${user?.firstName} ${user?.lastName}`} />
            <Detail label="Library card number" value={user?.barcode} />
            <Detail label="Email address" value={user?.email} />
            <ChangeDetailsModal
              id="change-email"
              buttonText="Change Email"
              content={ChangeEmail}
              onSuccess={({ email }) => {
                update({ email });
                setIsEmailUpdated(true);
              }}
            />
          </Section>

          <Section>
            <SectionHeading>Password</SectionHeading>
            <span>Update your password</span>
            <ChangeDetailsModal
              id="change-password"
              buttonText="Change password"
              content={ChangePassword}
              onSuccess={() => setIsPasswordUpdated(true)}
            />
          </Section>

          <Section>
            <SectionHeading>Delete library account</SectionHeading>
            <span>Request a deletion of your account</span>
            <ChangeDetailsModal id="delete-account" buttonText="Request deletion" isDangerous content={DeleteAccount} />
          </Section>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
};

export const MyAccount = withUserInfo(Profile);
