import { FunctionComponent, useState, useRef, useEffect } from 'react';
import Modal from '@weco/common/views/components/Modal/Modal';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import ButtonInline from '@weco/common/views/components/ButtonInline/ButtonInline';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { PhysicalItem, Work } from '@weco/common/model/catalogue';
import { classNames, font } from '@weco/common/utils/classnames';
import LL from '@weco/common/views/components/styled/LL';
import { useUserInfo } from '@weco/identity/src/frontend/MyAccount/UserInfoContext';
import { withPrefix } from '@weco/identity/src/frontend/MyAccount/UserInfoContext/UserInfoContext';

const Header = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Request = styled.div<{ isLoading: boolean }>`
  opacity: ${props => (props.isLoading ? 0.2 : 1)};
  transition: opacity ${props => props.theme.transitionProperties};
`;

const Remaining = styled(Space).attrs({
  h: { size: 's', properties: ['padding-left', 'margin-left'] },
})`
  border-left: 5px solid ${props => props.theme.color('yellow')};
`;

const BeforeYourVisit = styled(Space).attrs({
  as: 'p',
  h: { size: 'm', properties: ['padding-left'] },
  className: classNames({
    [font('hnr', 5)]: true,
  }),
})`
  border-left: 8px solid ${props => props.theme.color('yellow')};
`;

const CTAs = styled(Space).attrs({
  v: { size: 'l', properties: ['margin-top'] },
})``;

type Props = {
  work: Work;
  item: PhysicalItem;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
};

type UserHolds = {
  results: { item: { id: string } }[];
};

type RequestDialogProps = {
  isLoading: boolean;
  work: Work;
  item: PhysicalItem;
  confirmRequest: () => void;
  setIsActive: (value: boolean) => void;
  userHolds?: UserHolds;
};

const RequestDialog: FunctionComponent<RequestDialogProps> = ({
  isLoading,
  work,
  item,
  confirmRequest,
  setIsActive,
  userHolds,
}) => (
  <Request isLoading={isLoading}>
    <Header>
      <span className={`h2`}>Request item</span>
      {userHolds && (
        <Remaining>
          {15 - userHolds.results.length}/15 items remaining
        </Remaining>
      )}
    </Header>
    <p
      className={classNames({
        [font('hnb', 5)]: true,
        'no-margin': true,
      })}
    >
      You are about to request the following item:
    </p>
    <p className={'no-margin'}>
      {work.title && <span className="block">{work.title}</span>}
      {item.title && <span>{item.title}</span>}
    </p>
    <CTAs>
      <Space
        h={{ size: 'l', properties: ['margin-right'] }}
        v={{ size: 's', properties: ['margin-bottom'] }}
        className={'inline-block'}
      >
        <ButtonSolid
          disabled={isLoading}
          text={`Confirm request`}
          clickHandler={confirmRequest}
        />
      </Space>
      <ButtonOutlined
        disabled={isLoading}
        text={`Cancel request`}
        clickHandler={() => setIsActive(false)}
      />
    </CTAs>
  </Request>
);

type ConfirmedDialogProps = {
  work: Work;
  item: PhysicalItem;
  userHolds?: UserHolds;
};

const ConfirmedDialog: FunctionComponent<ConfirmedDialogProps> = ({
  work,
  item,
  userHolds,
}) => (
  <>
    <Header>
      <span className={`h2`}>Request confirmed</span>
      {userHolds && (
        <Remaining>
          {15 - userHolds.results.length}/15 items remaining
        </Remaining>
      )}
    </Header>
    <p
      className={classNames({
        [font('hnb', 5)]: true,
        'no-margin': true,
      })}
    >
      You have successfully requested:
    </p>
    <p>
      {work.title && <span className="block">{work.title}</span>}
      {item.title && <span>{item.title}</span>}
    </p>

    <p>
      It will be available to pick up from the library (Rare Materials Room, 2nd
      Floor) for two weeks.
    </p>
    <BeforeYourVisit>
      <span
        className={classNames({
          [font('hnb', 5)]: true,
        })}
      >
        Before your visit:
      </span>{' '}
      you will need to book a time slot for a library and museum ticket{' '}
      <em>(with material access)</em> at least 72 hours in advance of any visit.
    </BeforeYourVisit>
    <CTAs>
      <Space
        h={{ size: 'l', properties: ['margin-right'] }}
        v={{ size: 's', properties: ['margin-bottom'] }}
        className={'inline-block'}
      >
        <ButtonSolidLink
          text={`Book a ticket`}
          link={'/covid-book-your-ticket'}
        />
      </Space>
      <ButtonOutlinedLink
        text={`View your library account`}
        link={'/account'}
      />
    </CTAs>
  </>
);

type ErrorDialogProps = {
  setIsActive: (value: boolean) => void;
};

const ErrorDialog: FunctionComponent<ErrorDialogProps> = ({ setIsActive }) => (
  <>
    <Header>
      <span className={`h2`}>Request failed</span>
    </Header>
    <p className="no-margin">
      {/* TODO: get error code and construct appropriate message from response */}
      There was a problem requesting this item. Please try again.
    </p>
    <CTAs>
      <ButtonOutlined text={`Close`} clickHandler={() => setIsActive(false)} />
    </CTAs>
  </>
);

const ConfirmItemRequest: FunctionComponent<Props> = props => {
  const userInfo = useUserInfo();
  const user = userInfo.user;
  const isUserLoading = userInfo.isLoading;
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const { item, work, setIsActive, ...modalProps } = props;
  const [isLoading, setIsLoading] = useState(isUserLoading);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userHolds, setUserHolds] = useState<UserHolds | undefined>();
  const [isRequested, setIsRequested] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    fetch(withPrefix(`/api/users/${user.userId}/item-requests`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (!response.ok) return;

      if (isMounted) {
        response.json().then(setUserHolds);
      }
    });

    return () => {
      // We can't cancel promises, so using the isMounted value to prevent the component from trying to update the state if it's been unmounted.
      isMounted = false;
    };
    // TODO: work out why this doesn't update the remaining userHolds.length
    // once the user confirms (maybe just that the new request isn't immediately
    // reflected in the response?). And decide whether it would be better instead
    // to just decrement the hold number when isConfirmed is set to `true`
    // (one less call to the API)
  }, [isConfirmed]);

  useEffect(() => {
    if (userHolds) {
      setIsRequested(userHolds.results.some(r => r.item.id === item.id));
      setIsReady(true);
    }
  }, [userHolds]);

  function innerSetIsActive(value: boolean) {
    if (value) {
      setIsActive(true);
    } else if (isLoading) {
      // disable close dialog button during api call
    } else {
      setIsActive(false);
      setIsConfirmed(false);
      setIsError(false);
    }
  }

  async function confirmRequest() {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        withPrefix(`/api/users/${user.userId}/item-requests`),
        {
          // TODO withPrefix
          method: 'POST',
          body: JSON.stringify({
            workId: work.id,
            itemId: item.id,
            type: 'Item',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        setIsError(true);
        setIsLoading(false);
        // TODO: something to Sentry?
      } else {
        setIsConfirmed(true);
        setIsLoading(false);
      }
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      // TODO: error to Sentry?
    }
  }

  return isReady ? (
    <>
      {isRequested ? (
        // TODO: you currently will only see this immediately after requesting,
        // and not if you revisit this page after a successful request, because
        // this ConfirmRequest component won't render once the status/method
        // disallow it from what's in the items API response. You'll then see a
        // 'Item is in use by another reader' note, even if that reader is you.
        // Is this ok?
        <span>You have this item on hold</span>
      ) : (
        <>
          <ButtonInline
            ref={openButtonRef}
            text={'Request item'}
            clickHandler={() => setIsActive(true)}
          />

          <Modal
            {...modalProps}
            id="confirm-request-modal"
            setIsActive={innerSetIsActive}
            openButtonRef={openButtonRef}
          >
            {isLoading && <LL />}
            {isError && <ErrorDialog setIsActive={innerSetIsActive} />}
            {isConfirmed && !isError && (
              <ConfirmedDialog work={work} item={item} userHolds={userHolds} />
            )}
            {!isConfirmed && !isError && (
              <RequestDialog
                isLoading={isLoading}
                work={work}
                item={item}
                confirmRequest={confirmRequest}
                setIsActive={innerSetIsActive}
                userHolds={userHolds}
              />
            )}
          </Modal>
        </>
      )}
    </>
  ) : (
    <span>Loading…</span>
  );
};

export default ConfirmItemRequest;
