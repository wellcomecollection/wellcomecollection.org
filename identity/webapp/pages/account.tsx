import React, { FC, ComponentProps, useState } from 'react';
import Icon from '@weco/common/views/components/Icon/Icon';
import { NextPage } from 'next';
import { ChangeDetailsModal } from '../src/frontend/MyAccount/ChangeDetailsModal';
import { PageWrapper } from '../src/frontend/components/PageWrapper';
import {
  Container,
  Title,
  Header,
  Intro,
} from '../src/frontend/components/Layout.style';
import {
  SectionHeading,
  StatusAlert,
  Wrapper,
  StyledDl,
  StyledDd,
  ProgressBar,
  ProgressIndicator,
  ItemTitle,
  ItemStatus,
  ItemPickup,
  ButtonWrapper,
} from '../src/frontend/MyAccount/MyAccount.style';
import { Loading } from '../src/frontend/MyAccount/Loading';
import { ChangeEmail } from '../src/frontend/MyAccount/ChangeEmail';
import { ChangePassword } from '../src/frontend/MyAccount/ChangePassword';
import { DeleteAccount } from '../src/frontend/MyAccount/DeleteAccount';
import { useRequestedItems } from '../src/frontend/hooks/useRequestedItems';
import { useRouter } from 'next/router';
import WobblyEdge from '@weco/common/views/components/WobblyEdge/WobblyEdge';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import { allowedRequests } from '@weco/common/values/requests';
import { info2 } from '@weco/common/icons';
import StackingTable from '@weco/common/views/components/StackingTable/StackingTable';
import AlignFont from '@weco/common/views/components/styled/AlignFont';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';

type DetailProps = {
  label: string;
  value?: string;
};

type DetailListProps = {
  listItems: DetailProps[];
};

const Detail: FC<DetailProps> = ({ label, value }) => (
  <>
    <dt className={font('hnb', 5)}>{label}</dt>
    <StyledDd className={`${font('hnr', 5)}`}>{value}</StyledDd>
  </>
);

const DetailList: FC<DetailListProps> = ({ listItems }) => {
  return (
    <StyledDl>
      {listItems.map(item => (
        <Detail key={item.label} label={item.label} value={item.value} />
      ))}
    </StyledDl>
  );
};

const AccountStatus: FC<ComponentProps<typeof StatusAlert>> = ({
  type,
  children,
}) => {
  return (
    <StatusAlert type={type}>
      <Icon icon={info2} color={`currentColor`} />
      <AlignFont>
        <Space
          h={{
            size: 's',
            properties: ['margin-left'],
          }}
        >
          {children}
        </Space>
      </AlignFont>
    </StatusAlert>
  );
};

const AccountPage: NextPage = () => {
  const router = useRouter();
  const { user, state: userState } = useUser();

  const requests = useRequestedItems(user?.userId);
  const [isEmailUpdated, setIsEmailUpdated] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  const logoutOnDeletionRequest = () => {
    router.replace(
      `/logout?returnTo=${encodeURIComponent('/delete-requested')}`
    );
  };

  return (
    <PageWrapper title={`Your library account`}>
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
        {userState === 'loading' && <Loading />}
        {userState === 'signedin' && (
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
                <ButtonWrapper>
                  <ChangeDetailsModal
                    id="change-email"
                    buttonText="Change email"
                    onComplete={() => {
                      setIsEmailUpdated(true);
                    }}
                    render={props => <ChangeEmail {...props} />}
                  />
                </ButtonWrapper>
                <ButtonWrapper>
                  <ChangeDetailsModal
                    id="change-password"
                    buttonText="Change password"
                    onComplete={() => {
                      setIsPasswordUpdated(true);
                    }}
                    render={props => <ChangePassword {...props} />}
                  />
                </ButtonWrapper>
              </Wrapper>
            </Container>

            <SectionHeading>Item requests</SectionHeading>
            <Container>
              <Wrapper>
                {requests && requests.totalResults === 0 && (
                  <p className={`${font('hnr', 5)}`}>
                    Any item requests you make will appear here.
                  </p>
                )}
                {requests && requests.totalResults !== 0 && (
                  <>
                    <Space
                      as="p"
                      className={`${font('hnb', 5)}`}
                      v={{ size: 's', properties: ['margin-bottom'] }}
                    >{`You have requested ${requests?.totalResults} out of ${allowedRequests} items`}</Space>
                    <ProgressBar>
                      <ProgressIndicator
                        percentage={
                          (requests.totalResults / allowedRequests) * 100
                        }
                      />
                    </ProgressBar>
                    <StackingTable
                      rows={[
                        ['Title', 'Status', 'Pickup location'],
                        ...requests.results.map(result => [
                          <>
                            <ItemTitle as="a" href={`/works/${result.workId}`}>
                              {result.workTitle || 'Unknown title'}
                            </ItemTitle>
                            {result.item.title && (
                              <Space
                                v={{
                                  size: 's',
                                  properties: ['margin-top'],
                                }}
                              >
                                <ItemTitle>{result.item.title}</ItemTitle>
                              </Space>
                            )}
                          </>,
                          <ItemStatus key={`${result.item.id}-status`}>
                            {result.status.label}
                          </ItemStatus>,
                          <ItemPickup key={`${result.item.id}-pickup`}>
                            {result.pickupLocation.label}
                          </ItemPickup>,
                        ]),
                      ]}
                    />
                    <Space
                      className={`${font('hnr', 5)}`}
                      v={{
                        size: 'l',
                        properties: ['margin-top', 'margin-bottom'],
                      }}
                    >
                      Requests made will be available to pick up from the
                      library for one week. If you wish to cancel a hold, please{' '}
                      <a href="mailto:library@wellcomecollection.org">
                        contact the library team.
                      </a>
                    </Space>
                  </>
                )}
              </Wrapper>
            </Container>

            <SectionHeading>Cancel library membership</SectionHeading>
            <Container>
              <Wrapper>
                <p className={font('hnr', 5)}>
                  If you no longer wish to be a Wellcome library member, you can
                  cancel your membership. The library team will be notified and
                  your online account will be closed.
                </p>
                <ButtonWrapper>
                  <ChangeDetailsModal
                    id="delete-account"
                    buttonText="Cancel your membership"
                    onComplete={logoutOnDeletionRequest}
                    render={props => <DeleteAccount {...props} />}
                  />
                </ButtonWrapper>
              </Wrapper>
            </Container>
          </>
        )}
      </Layout10>
    </PageWrapper>
  );
};

export default AccountPage;
