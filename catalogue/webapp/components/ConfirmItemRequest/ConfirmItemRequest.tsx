import { FunctionComponent, useState, useRef, useEffect } from 'react';
import Modal from '@weco/common/views/components/Modal/Modal';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { PhysicalItem, Work } from '@weco/common/model/catalogue';
import { classNames, font } from '@weco/common/utils/classnames';
import LL from '@weco/common/views/components/styled/LL';
import { withAppPathPrefix } from '@weco/identity/src/utility/app-path-prefix';
import { UserInfo } from '@weco/identity/src/frontend/MyAccount/UserInfoContext/UserInfo.interface';

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

export const allowedRequests = 15;

const RemainingRequests: FunctionComponent<{
  allowedHoldRequests: number;
  currentHoldRequests: number;
}> = ({ allowedHoldRequests, currentHoldRequests }) => (
  <Remaining>
    {`${
      allowedHoldRequests - currentHoldRequests
    }/${allowedHoldRequests} items remaining`}
  </Remaining>
);

type Props = {
  work: Work;
  item: PhysicalItem;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  user: UserInfo;
  initialHoldNumber: number;
};

type RequestDialogProps = {
  isLoading: boolean;
  work: Work;
  item: PhysicalItem;
  confirmRequest: () => void;
  setIsActive: (value: boolean) => void;
  currentHoldNumber: number;
};

const RequestDialog: FunctionComponent<RequestDialogProps> = ({
  isLoading,
  work,
  item,
  confirmRequest,
  setIsActive,
  currentHoldNumber,
}) => (
  <Request isLoading={isLoading}>
    <Header>
      <span className={`h2`}>Request item</span>
      <RemainingRequests
        allowedHoldRequests={allowedRequests}
        currentHoldRequests={currentHoldNumber}
      />
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
  currentHoldNumber: number;
};

const ConfirmedDialog: FunctionComponent<ConfirmedDialogProps> = ({
  work,
  item,
  currentHoldNumber,
}) => (
  <>
    <Header>
      <span className={`h2`}>Request confirmed</span>
      <RemainingRequests
        allowedHoldRequests={allowedRequests}
        currentHoldRequests={currentHoldNumber}
      />
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
      {/* TODO: get error code and construct appropriate message from response - see #6916 */}
      There was a problem requesting this item. Please try again.
    </p>
    <CTAs>
      <ButtonOutlined text={`Close`} clickHandler={() => setIsActive(false)} />
    </CTAs>
  </>
);

type RequestingState = undefined | 'requesting' | 'confirmed' | 'error';

const ConfirmItemRequest: FunctionComponent<Props> = ({
  item,
  work,
  setIsActive,
  user,
  initialHoldNumber,
  ...modalProps
}) => {
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const [requestingState, setRequestingState] = useState<RequestingState>();
  const [currentHoldNumber, setCurrentHoldNumber] = useState(initialHoldNumber);
  function innerSetIsActive(value: boolean) {
    if (requestingState === 'requesting') return; // we don't want the modal to close during an api call
    if (value) {
      setIsActive(true);
    } else {
      setIsActive(false);
      if (requestingState !== 'confirmed') {
        setRequestingState(undefined);
      }
    }
  }

  useEffect(() => {
    setCurrentHoldNumber(initialHoldNumber);
  }, [initialHoldNumber]); // This will update when the PhysicalItemDetails component renders and the userHolds are updated

  async function confirmRequest() {
    if (!user) return;
    setRequestingState('requesting');
    try {
      const response = await fetch(
        withAppPathPrefix(`/api/users/${user.userId}/item-requests`),
        {
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
        setRequestingState('error');
        // TODO: something to Sentry?
      } else {
        setRequestingState('confirmed');
        setCurrentHoldNumber(currentHoldNumber + 1);
        // If we get the users current holds, immediately following a successful request, the api response isn't updated quickly enough to include the new request
        // We therefore increment the currentHoldNumber manually following a successful request
      }
    } catch (error) {
      setRequestingState('error');
      // TODO: error to Sentry?
    }
  }

  function renderModalContent(requestingState: RequestingState) {
    switch (requestingState) {
      case 'requesting':
        return <LL />;
      case 'error':
        return <ErrorDialog setIsActive={innerSetIsActive} />;
      case 'confirmed':
        return (
          <ConfirmedDialog
            work={work}
            item={item}
            currentHoldNumber={currentHoldNumber}
          />
        );
      default:
        return (
          <RequestDialog
            isLoading={requestingState === 'requesting'}
            work={work}
            item={item}
            confirmRequest={confirmRequest}
            setIsActive={innerSetIsActive}
            currentHoldNumber={currentHoldNumber}
          />
        );
    }
  }

  return requestingState === 'confirmed' && !modalProps.isActive ? (
    <span>You have this item on hold</span>
  ) : (
    <>
      <ButtonOutlined
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
        {renderModalContent(requestingState)}
      </Modal>
    </>
  );
};

export default ConfirmItemRequest;
