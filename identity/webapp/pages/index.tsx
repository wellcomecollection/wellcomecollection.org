import React, {
  FC,
  ComponentProps,
  useState,
  ComponentPropsWithoutRef,
} from 'react';
import Icon from '@weco/common/views/components/Icon/Icon';
import { GetServerSideProps, NextPage } from 'next';
import { withPageAuthRequiredSSR } from '../src/utility/auth0';
import { ChangeDetailsModal } from '../src/frontend/MyAccount/ChangeDetailsModal';
import { PageWrapper } from '../src/frontend/components/PageWrapper';
import {
  Wrapper,
  Container,
  Title,
  Header,
  SectionHeading,
} from '../src/frontend/components/Layout.style';
import {
  StatusAlert,
  StyledDl,
  StyledDd,
  ProgressBar,
  ProgressIndicator,
  ItemTitle,
  ItemStatus,
  ItemPickup,
  ButtonWrapper,
} from '../src/frontend/MyAccount/MyAccount.style';
import { InlineLoading, Loading } from '../src/frontend/MyAccount/Loading';
import { ChangeEmail } from '../src/frontend/MyAccount/ChangeEmail';
import { ChangePassword } from '../src/frontend/MyAccount/ChangePassword';
import { DeleteAccount } from '../src/frontend/MyAccount/DeleteAccount';
import { useRequestedItems } from '../src/frontend/hooks/useRequestedItems';
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
import { getServerData } from '@weco/common/server-data';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { ServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/views/pages/_app';

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

const TextButton: FC<ComponentPropsWithoutRef<'button'>> = ({
  children,
  ...props
}) => (
  <button
    className={font('hnr', 5)}
    style={{
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
    }}
    {...props}
  >
    {children}
  </button>
);

const RequestsFailed: FC<{ retry: () => void }> = ({ retry }) => (
  <p className={`${font('hnr', 5)}`}>
    Something went wrong fetching your item requests.
    <TextButton
      onClick={() => {
        retry();
      }}
    >
      Try again
    </TextButton>
  </p>
);

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

type Props = {
  serverData: ServerData;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  withPageAuthRequiredSSR({
    getServerSideProps: async context => {
      const serverData = await getServerData(context);
      return {
        props: removeUndefinedProps({
          serverData,
        }),
      };
    },
  });

const AccountPage: NextPage = () => {
  const { user, state: userState } = useUser();

  const {
    requestedItems,
    state: requestedItemsState,
    fetchRequests,
  } = useRequestedItems();
  const [isEmailUpdated, setIsEmailUpdated] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

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
            <SectionHeading addBottomPadding={true}>
              Personal details
            </SectionHeading>
            <Container>
              <Wrapper removeBottomPadding={true}>
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

            <SectionHeading addBottomPadding={true}>
              Item requests
            </SectionHeading>
            <Container>
              <Wrapper>
                {(() => {
                  switch (requestedItemsState) {
                    case 'initial':
                    case 'loading':
                      return (
                        <Space
                          v={{ size: 'l', properties: ['padding-bottom'] }}
                        >
                          <InlineLoading />
                        </Space>
                      );
                    case 'failed':
                      return <RequestsFailed retry={fetchRequests} />;
                    case 'success':
                      if (requestedItems.totalResults === 0) {
                        return (
                          <p className={`${font('hnr', 5)}`}>
                            Any item requests you make will appear here.
                          </p>
                        );
                      } else {
                        return (
                          <>
                            <Space
                              as="p"
                              className={`${font('hnb', 5)}`}
                              v={{ size: 's', properties: ['margin-bottom'] }}
                            >{`You have requested ${requestedItems.totalResults} out of ${allowedRequests} items`}</Space>
                            <ProgressBar>
                              <ProgressIndicator
                                percentage={
                                  (requestedItems.totalResults /
                                    allowedRequests) *
                                  100
                                }
                              />
                            </ProgressBar>
                            <StackingTable
                              rows={[
                                ['Title', 'Status', 'Pickup location'],
                                ...requestedItems.results.map(result => [
                                  <>
                                    <ItemTitle
                                      as="a"
                                      href={`/works/${result.workId}`}
                                    >
                                      {result.workTitle || 'Unknown title'}
                                    </ItemTitle>
                                    {result.item.title && (
                                      <Space
                                        v={{
                                          size: 's',
                                          properties: ['margin-top'],
                                        }}
                                      >
                                        <ItemTitle>
                                          {result.item.title}
                                        </ItemTitle>
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
                                properties: ['margin-top'],
                              }}
                            >
                              Requests made will be available to pick up from
                              the library for one week. If you wish to cancel a
                              request, please{' '}
                              <a href="mailto:library@wellcomecollection.org">
                                contact the library team.
                              </a>
                            </Space>
                          </>
                        );
                      }
                  }
                })()}
              </Wrapper>
            </Container>

            <SectionHeading addBottomPadding={true}>
              Cancel library membership
            </SectionHeading>
            <Container>
              <Wrapper>
                <p className={font('hnr', 5)}>
                  If you no longer wish to be a library member, you can cancel
                  your membership. The library team will be notified and your
                  online account will be closed.
                </p>
                <ChangeDetailsModal
                  id="delete-account"
                  buttonText="Cancel your membership"
                  onComplete={() => {
                    /* TODO: implement this */
                  }}
                  render={props => <DeleteAccount {...props} />}
                />
              </Wrapper>
            </Container>
          </>
        )}
      </Layout10>
    </PageWrapper>
  );
};

export default AccountPage;
