import { Claims } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  ComponentPropsWithoutRef,
  FunctionComponent,
  PropsWithChildren,
  useState,
} from 'react';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { sierraStatusCodeToLabel } from '@weco/common/data/microcopy';
import { info2 } from '@weco/common/icons';
import {
  Auth0UserProfile,
  auth0UserProfileToUserInfo,
} from '@weco/common/model/user';
import { font } from '@weco/common/utils/classnames';
import { allowedRequests } from '@weco/common/values/requests';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import StackingTable from '@weco/common/views/components/StackingTable';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import { useRequestedItems } from '@weco/identity/hooks/useRequestedItems';
import { useSendVerificationEmail } from '@weco/identity/hooks/useSendVerificationEmail';
import ChangeDetailsModal from '@weco/identity/views/components/ChangeDetailsModal';
import DeleteAccount from '@weco/identity/views/components/DeleteAccount';
import { InlineLoading } from '@weco/identity/views/components/Loading';
import {
  ChangeEmail,
  ChangePassword,
} from '@weco/identity/views/components/MyAccount';
import {
  StatusAlert,
  StatusAlertProps,
} from '@weco/identity/views/components/styled/alert';
import {
  Container,
  Header,
  SectionHeading,
  Title,
  Wrapper,
} from '@weco/identity/views/components/styled/layouts';
import UnverifiedEmail from '@weco/identity/views/components/UnverifiedEmail';
import IdentityPageLayout from '@weco/identity/views/layouts/IdentityPageLayout';

import {
  ButtonWrapper,
  ItemPickup,
  ItemStatus,
  ItemTitle,
  ProgressBar,
  ProgressIndicator,
  StyledDd,
  StyledDl,
} from './index.styles';

type DetailProps = {
  label: string;
  value?: string;
};

type DetailListProps = {
  listItems: DetailProps[];
};

const Detail: FunctionComponent<DetailProps> = ({ label, value }) => (
  <>
    <dt className={font('intb', 5)}>{label}</dt>
    <StyledDd className={font('intr', 5)}>{value}</StyledDd>
  </>
);

const DetailList: FunctionComponent<DetailListProps> = ({ listItems }) => {
  return (
    <StyledDl>
      {listItems.map(item => (
        <Detail key={item.label} label={item.label} value={item.value} />
      ))}
    </StyledDl>
  );
};

const TextButton: FunctionComponent<ComponentPropsWithoutRef<'button'>> = ({
  children,
  ...props
}) => (
  <button
    className={font('intr', 5)}
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

const RequestsFailed: FunctionComponent<{ retry: () => void }> = ({
  retry,
}) => (
  <p className={font('intr', 5)}>
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

const AccountStatus: FunctionComponent<PropsWithChildren<StatusAlertProps>> = ({
  type,
  children,
}) => {
  return (
    <StatusAlert type={type}>
      <Icon icon={info2} />
      <Space $h={{ size: 's', properties: ['margin-left'] }}>{children}</Space>
    </StatusAlert>
  );
};

const NoRequestedItems = () => (
  <Space
    as="p"
    className={font('intr', 5)}
    $v={{
      size: 's',
      properties: ['margin-bottom'],
      overrides: { small: 1 },
    }}
  >
    Any item requests you make will appear here.
  </Space>
);

export type Props = {
  user?: Claims;
};

const AccountPage: NextPage<Props> = ({ user: auth0UserClaims }) => {
  const {
    requestedItems,
    state: requestedItemsState,
    fetchRequests,
  } = useRequestedItems();
  const sendVerificationEmail = useSendVerificationEmail();
  const { user: contextUser } = useUserContext();
  const [isEmailUpdated, setIsEmailUpdated] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  // Use the user from the context provider as first preference, as it will
  // change without a page reload being required
  const user =
    contextUser ||
    auth0UserProfileToUserInfo(auth0UserClaims as Auth0UserProfile);

  const router = useRouter();

  const logoutOnDeletionRequest = () => {
    router.replace(
      `/api/auth/logout?returnTo=${encodeURIComponent('/delete-requested')}`
    );
  };

  return (
    <IdentityPageLayout title="Your library account">
      <Header $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space
            $v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
          >
            <Title>Library account</Title>
          </Space>
        </ContaineredLayout>
        <div className="is-hidden-s">
          <WobblyEdge backgroundColor="warmNeutral.300" />
        </div>
      </Header>
      <ContaineredLayout gridSizes={gridSize10()}>
        <>
          {!user?.emailValidated && (
            <AccountStatus type="info">
              <UnverifiedEmail {...sendVerificationEmail} />
            </AccountStatus>
          )}
          {isEmailUpdated && (
            <AccountStatus type="success">Email updated</AccountStatus>
          )}
          {isPasswordUpdated && (
            <AccountStatus type="success">Password updated</AccountStatus>
          )}
          <SectionHeading $addBottomPadding={true}>
            Personal details
          </SectionHeading>
          <Container>
            <Wrapper $removeBottomPadding={true}>
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

          <SectionHeading $addBottomPadding={true}>
            Item requests
          </SectionHeading>
          <Container>
            <Wrapper>
              {!requestedItems ? (
                <NoRequestedItems />
              ) : (
                <>
                  {(() => {
                    switch (requestedItemsState) {
                      case 'initial':
                      case 'loading':
                        return (
                          <Space
                            $v={{ size: 'l', properties: ['padding-bottom'] }}
                          >
                            <InlineLoading />
                          </Space>
                        );
                      case 'failed':
                        return <RequestsFailed retry={fetchRequests} />;
                      case 'success':
                        if (requestedItems.totalResults === 0) {
                          return <NoRequestedItems />;
                        } else {
                          return (
                            <>
                              <Space
                                as="p"
                                className={font('intb', 5)}
                                $v={{
                                  size: 's',
                                  properties: ['margin-bottom'],
                                }}
                              >{`You have requested ${requestedItems.totalResults} out of ${allowedRequests} items`}</Space>
                              <ProgressBar>
                                <ProgressIndicator
                                  $percentage={
                                    (requestedItems.totalResults /
                                      allowedRequests) *
                                    100
                                  }
                                />
                              </ProgressBar>
                              <StackingTable
                                maxWidth={1180}
                                rows={[
                                  [
                                    'Title',
                                    'Status',
                                    'Pickup date requested',
                                    'Pickup location',
                                  ].filter(Boolean),
                                  ...requestedItems.results.map(result =>
                                    [
                                      <>
                                        <ItemTitle
                                          as="a"
                                          href={`/works/${result.workId}`}
                                        >
                                          {result.workTitle || 'Unknown title'}
                                        </ItemTitle>
                                        {result.item.title && (
                                          <Space
                                            $v={{
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
                                      <ItemStatus
                                        key={`${result.item.id}-status`}
                                      >
                                        {sierraStatusCodeToLabel[
                                          result.status.id
                                        ] ?? result.status.label}
                                      </ItemStatus>,
                                      result.pickupDate ? (
                                        <HTMLDate
                                          date={new Date(result.pickupDate)}
                                        />
                                      ) : (
                                        <p>n/a</p>
                                      ),
                                      <ItemPickup
                                        key={`${result.item.id}-pickup`}
                                      >
                                        {result.pickupLocation.label}
                                      </ItemPickup>,
                                    ].filter(Boolean)
                                  ),
                                ]}
                              />
                              <Space
                                className={font('intr', 5)}
                                $v={{
                                  size: 'l',
                                  properties: ['margin-top'],
                                }}
                              >
                                Requests made will be available to pick up from
                                the library for one week from your selected
                                pickup date. If you wish to cancel a request,
                                please{' '}
                                <a href="mailto:library@wellcomecollection.org">
                                  contact the library team.
                                </a>
                              </Space>
                            </>
                          );
                        }
                    }
                  })()}
                </>
              )}
            </Wrapper>
          </Container>

          <SectionHeading $addBottomPadding={true}>
            Cancel library membership
          </SectionHeading>
          <Container>
            <Wrapper>
              <p className={font('intr', 5)}>
                If you no longer wish to be a library member, you can cancel
                your membership. The library team will be notified and your
                online account will be closed.
              </p>
              <ChangeDetailsModal
                id="delete-account"
                buttonText="Cancel your membership"
                onComplete={logoutOnDeletionRequest}
                render={props => <DeleteAccount {...props} />}
              />
            </Wrapper>
          </Container>
        </>
      </ContaineredLayout>
    </IdentityPageLayout>
  );
};

export default AccountPage;
