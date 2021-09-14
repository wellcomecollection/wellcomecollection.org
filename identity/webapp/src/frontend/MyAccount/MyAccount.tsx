import React, { FC, ComponentProps, useState, useEffect } from 'react';
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  useUserInfo,
  withUserInfo,
} from '@weco/common/views/components/UserInfoContext';
import { ChangeDetailsModal } from './ChangeDetailsModal';
import { PageWrapper } from '../components/PageWrapper';
import { Container, Title, Header, Intro } from '../components/Layout.style';
import {
  SectionHeading,
  StatusAlert,
  Wrapper,
  StyledDl,
  StyledDd,
  ProgressBar,
  ProgressIndicator,
  TruncateTitle,
} from './MyAccount.style';
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
import Table from '@weco/common/views/components/Table/Table';
import { font } from '@weco/common/utils/classnames';
import { RequestsList } from '@weco/common/model/requesting';
import { allowedRequests } from '@weco/common/values/requests';
import { withAppPathPrefix } from '@weco/common/utils/identity-path-prefix';

type DetailProps = {
  label: string;
  value?: string;
};

type DetailListProps = {
  listItems: DetailProps[];
};

const DetailList: FC<DetailListProps> = ({ listItems }) => {
  return (
    <StyledDl>
      {listItems.map(item => (
        <Detail key={item.label} label={item.label} value={item.value} />
      ))}
    </StyledDl>
  );
};

const Detail: FC<DetailProps> = ({ label, value }) => (
  <>
    <dt className={font('hnb', 5)}>{label}</dt>
    <StyledDd className={`${font('hnr', 5)}`}>{value}</StyledDd>
  </>
);

const AccountStatus: FC<ComponentProps<typeof StatusAlert>> = ({
  type,
  children,
}) => {
  return (
    <StatusAlert type={type}>
      <Icon name={`info2`} color={`currentColor`} />
      {children}
    </StatusAlert>
  );
};

async function fetchRequestedItems(userId): Promise<RequestsList | undefined> {
  try {
    const response = await fetch(
      withAppPathPrefix(`/api/users/${userId}/item-requests`)
    );
    const json = await response.json();
    return json;
  } catch (e) {
    console.log(e);
  }
}

const Profile: FC = () => {
  const history = useHistory();
  const { user, isLoading, update } = useUserInfo();
  const [isEmailUpdated, setIsEmailUpdated] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [requests, setRequests] = useState<RequestsList>();

  useEffect(() => {
    async function fetchRequests() {
      if (user && user.userId) {
        const items = await fetchRequestedItems(user.userId);
        setRequests(items);
      }
    }
    fetchRequests();
  }, [user]);

  const logoutOnDeletionRequest = () => {
    history.replace(
      `/logout?returnTo=${encodeURIComponent('/delete-requested')}`
    );
  };

  return (
    <PageWrapper>
      <Header
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
              {/* TODO get real text */}
              {/* Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis magni reprehenderit at cum repudiandae
              architecto eaque facere optio culpa, quasi amet, nobis ipsa quaerat error debitis maxime minima veritatis.
              Corrupti? */}
            </Intro>
          </Space>
        </Layout12>
        <div className="is-hidden-s">
          <WobblyEdge background="cream" />
        </div>
      </Header>
      <Layout10>
        {isLoading && <Loading />}
        {!isLoading && (
          <>
            {!user?.emailValidated && (
              <AccountStatus type="info">
                You have not yet validated your email address
              </AccountStatus>
            )}
            {isEmailUpdated && (
              <AccountStatus type="success">Email updated</AccountStatus>
            )}
            {isPasswordUpdated && (
              <AccountStatus type="success">Password updated</AccountStatus>
            )}
            <SectionHeading>Personal details</SectionHeading>
            <Container>
              <Wrapper>
                <DetailList
                  listItems={[
                    {
                      label: 'Name',
                      value: `${user?.firstName} ${user?.lastName}`,
                    },
                    { label: 'Email', value: user?.email },
                    { label: 'Library card number', value: user?.barcode },
                    /* Membership expiry date? */
                  ]}
                />
                <Space
                  as="span"
                  h={{
                    size: 'l',
                    properties: ['margin-right'],
                  }}
                >
                  <ChangeDetailsModal
                    id="change-email"
                    buttonText="Change email"
                    onComplete={(newUserInfo?: UpdateUserSchema) => {
                      if (newUserInfo) update(newUserInfo);
                      setIsEmailUpdated(true);
                    }}
                  >
                    <ChangeEmail />
                  </ChangeDetailsModal>
                </Space>
                <ChangeDetailsModal
                  id="change-password"
                  buttonText="Change password"
                  onComplete={() => {
                    setIsPasswordUpdated(true);
                  }}
                >
                  <ChangePassword />
                </ChangeDetailsModal>
              </Wrapper>
            </Container>

            <SectionHeading>Item requests</SectionHeading>
            <Container>
              <Wrapper>
                {requests && requests.totalResults === 0 && (
                  <p className={`${font('hnr', 4)}`}>
                    Any item requests you make will appear here.
                  </p>
                )}
                {requests && requests.totalResults !== 0 && (
                  <>
                    <Space
                      as="p"
                      className={`${font('hnb', 5)}`}
                      v={{ size: 's', properties: ['margin-bottom'] }}
                    >{`${allowedRequests -
                      requests?.totalResults} of ${allowedRequests} requests remaining`}</Space>
                    <ProgressBar>
                      <ProgressIndicator
                        percentage={
                          (requests.totalResults / allowedRequests) * 100
                        }
                      />
                    </ProgressBar>
                    <Table
                      hasRowHeaders={false}
                      plain={true}
                      withBorder={false}
                      rows={[
                        ['Title', 'Status', 'Pickup location'],
                        ...requests.results.map(result => [
                          <TruncateTitle href={`/works/${result.workId}`}>{result.item.title || result.workTitle || ''}</TruncateTitle>,
                          result.status.label,
                          result.pickupLocation.label,
                        ]),
                      ]}
                    />
                    <Space
                      className={`${font('hnb', 5)}`}
                      v={{
                        size: 'l',
                        properties: ['margin-top'],
                      }}
                    >
                      If you wish to cancel a hold, please{' '}
                      <a href="mailto:library@wellcomecollection.org">
                        contact the library team.
                      </a>
                    </Space>
                  </>
                )}
              </Wrapper>
            </Container>

            <SectionHeading>Delete library account</SectionHeading>
            <Container>
              <Wrapper>
                <p className={font('hnb', 5)}>
                  Request a deletion of your account
                </p>
                <ChangeDetailsModal
                  id="delete-account"
                  buttonText="Request deletion"
                  isDangerous
                  onComplete={logoutOnDeletionRequest}
                >
                  <DeleteAccount />
                </ChangeDetailsModal>
              </Wrapper>
            </Container>
          </>
        )}
      </Layout10>
    </PageWrapper>
  );
};

export const MyAccount = withUserInfo(Profile);
