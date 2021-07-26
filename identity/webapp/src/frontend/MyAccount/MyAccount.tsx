import React, { useState } from 'react';
import Info2 from '@weco/common/icons/components/Info2';

import { useUserInfo, withUserInfo } from './UserInfoContext';
import { ChangeDetailsModal } from './ChangeDetailsModal';
import { PageWrapper } from '../components/PageWrapper';
import { Container, Title, Header, Intro } from '../components/Layout.style';
import { SectionHeading, StatusAlert, Wrapper } from './MyAccount.style';
import { Loading } from './Loading';
import { ChangeEmail } from './ChangeEmail';
import { ChangePassword } from './ChangePassword';
import { DeleteAccount } from './DeleteAccount';
import { UpdateUserSchema } from '../../types/schemas/update-user';
import { useHistory } from 'react-router';
import WobblyEdge from '@weco/common/views/components/WobblyEdge/WobblyEdge';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';

const Detail: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <>
    <dt>{label}</dt>
    <dd>{value}</dd>
  </>
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
      {/* get rid of classname enhanced */}
      {/* make into it's own component */}
      <Header
        className="enhanced"
        v={{
          size: 'l',
          properties: ['margin-bottom'],
        }}
      >
        <Layout12>
          <Space
            v={{
              size: 'l',
              properties: ['padding-top', 'padding-bottom'],
            }}
          >
            <Title>Library account</Title>
            <Intro>
              {/* TODO real text or comment out for now */}
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis magni reprehenderit at cum repudiandae
              architecto eaque facere optio culpa, quasi amet, nobis ipsa quaerat error debitis maxime minima veritatis.
              Corrupti?
            </Intro>
          </Space>
        </Layout12>
        {/* TODO remove from small screen */}
        <WobblyEdge background="cream" isStatic />
      </Header>
      <Layout10>
        <SectionHeading>Personal details</SectionHeading>
        <Container>
          <Wrapper>
            {!user?.emailValidated && (
              <AccountStatus type="info">You have not yet validated your email address</AccountStatus>
            )}
            {isEmailUpdated && <AccountStatus type="success">Email updated</AccountStatus>}
            {isPasswordUpdated && <AccountStatus type="success">Password updated</AccountStatus>}
            <>
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
              <ChangeDetailsModal
                id="change-password"
                buttonText="Change password"
                onComplete={() => {
                  setIsPasswordUpdated(true);
                }}
              >
                <ChangePassword />
              </ChangeDetailsModal>
            </>
          </Wrapper>
        </Container>

        <SectionHeading>Delete library account</SectionHeading>
        <Container>
          <Wrapper>
            <>
              <span>Request a deletion of your account</span>
              <ChangeDetailsModal
                id="delete-account"
                buttonText="Request deletion"
                isDangerous
                onComplete={logoutOnDeletionRequest}
              >
                <DeleteAccount />
              </ChangeDetailsModal>
            </>
          </Wrapper>
        </Container>
      </Layout10>
    </PageWrapper>
  );
};

export const MyAccount = withUserInfo(Profile);
