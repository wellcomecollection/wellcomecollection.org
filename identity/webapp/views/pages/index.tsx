import { Claims } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { useTheme } from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { sierraStatusCodeToLabel } from '@weco/common/data/microcopy';
import { info2 } from '@weco/common/icons';
import {
  Auth0UserProfile,
  auth0UserProfileToUserInfo,
} from '@weco/common/model/user';
import { font } from '@weco/common/utils/classnames';
import { allowedRequests } from '@weco/common/values/requests';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import StackingTable from '@weco/common/views/components/StackingTable';
import Space from '@weco/common/views/components/styled/Space';
import { useRequestedItems } from '@weco/identity/hooks/useRequestedItems';
import { useSendVerificationEmail } from '@weco/identity/hooks/useSendVerificationEmail';
import ChangeDetailsModal from '@weco/identity/views/components/ChangeDetailsModal';
import Loading from '@weco/identity/views/components/Loading';
import {
  StatusAlert,
  StatusAlertProps,
} from '@weco/identity/views/components/styled/Alert';
import {
  Container,
  SectionHeading,
  Wrapper,
} from '@weco/identity/views/components/styled/Layouts';
import IdentityPageLayout from '@weco/identity/views/layouts/IdentityPageLayout';

import ChangeEmail from './index.ChangeEmail';
import ChangePassword from './index.ChangePassword';
import DeleteAccount from './index.DeleteAccount';
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
import UnverifiedEmail from './index.UnverifiedEmail';

const DetailList: FunctionComponent<{
  listItems: {
    label: string;
    value?: string;
  }[];
}> = ({ listItems }) => {
  return (
    <StyledDl>
      {listItems.map(item => (
        <>
          <dt className={font('sans-bold', -1)}>{item.label}</dt>
          <StyledDd className={font('sans', -1)}>{item.value}</StyledDd>
        </>
      ))}
    </StyledDl>
  );
};

const RequestsFailed: FunctionComponent<{ retry: () => void }> = ({
  retry,
}) => (
  <p className={font('sans', -1)}>
    Something went wrong fetching your item requests.
    <button
      className={font('sans', -1)}
      style={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
      }}
      onClick={() => {
        retry();
      }}
    >
      Try again
    </button>
  </p>
);

const AccountStatus: FunctionComponent<PropsWithChildren<StatusAlertProps>> = ({
  type,
  children,
}) => {
  return (
    <StatusAlert type={type}>
      <Icon icon={info2} />
      <Space $h={{ size: 'xs', properties: ['margin-left'] }}>{children}</Space>
    </StatusAlert>
  );
};

const NoRequestedItems = () => (
  <Space
    as="p"
    className={font('sans', -1)}
    $v={{
      size: 'xs',
      properties: ['margin-bottom'],
      overrides: { zero: 1 },
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
  const theme = useTheme();

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

  const listItems = [
    {
      label: 'Name',
      value: `${user?.firstName} ${user?.lastName}`,
    },
    { label: 'Email', value: user?.email },
    { label: 'Library card number', value: user?.barcode },
    /* Membership expiry date? */
  ];

  return (
    <IdentityPageLayout title="Your library account">
      <Space
        $v={{ size: 'md', properties: ['margin-bottom'] }}
        style={{ background: theme.color('white') }}
      >
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space
            $v={{ size: 'md', properties: ['padding-top', 'padding-bottom'] }}
          >
            <h1 className={font('brand', 5)}>Library account</h1>
          </Space>
        </ContaineredLayout>
        <div className="is-hidden-s">
          <DecorativeEdge variant="wobbly" backgroundColor="warmNeutral.300" />
        </div>
      </Space>
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
              <DetailList listItems={listItems} />
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
                            $v={{ size: 'md', properties: ['padding-bottom'] }}
                          >
                            <Loading variant="inline" />
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
                                className={font('sans-bold', -1)}
                                $v={{
                                  size: 'xs',
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
                                maxWidth="73.75rem"
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
                                              size: 'xs',
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
                                        <HTMLDateAndTime
                                          variant="date"
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
                                className={font('sans', -1)}
                                $v={{
                                  size: 'md',
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
              <p className={font('sans', -1)}>
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
