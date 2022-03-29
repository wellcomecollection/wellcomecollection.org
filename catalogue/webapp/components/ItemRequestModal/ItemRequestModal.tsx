import {
  FC,
  useState,
  useEffect,
  MutableRefObject,
  FormEvent,
  ReactNode,
} from 'react';
import { Moment } from 'moment';
import { DayNumber } from '@weco/common/model/opening-hours';
import { london, londonFromFormat } from '@weco/common/utils/format-date';
import { isRequestableDate } from '@weco/catalogue/utils/dates';
import { useToggles } from '@weco/common/server-data/Context';
import Modal from '@weco/common/views/components/Modal/Modal';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import {
  PhysicalItem,
  Work,
  CatalogueApiError,
} from '@weco/common/model/catalogue';
import { classNames, font } from '@weco/common/utils/classnames';
import LL from '@weco/common/views/components/styled/LL';
import { allowedRequests } from '@weco/common/values/requests';
import RequestingDayPicker from '../RequestingDayPicker/RequestingDayPicker';
import { convertDayNumberToDay } from '../../utils/dates';
import { trackEvent } from '@weco/common/utils/ga';
import { defaultRequestErrorMessage } from '@weco/common/data/microcopy';
import { useAvailableDates } from './useAvailableDates';

function arrayofItemsToText(arr) {
  if (arr.length === 1) return arr[0];
  const initialItems = arr.slice(0, -1);
  const lastItem = arr[arr.length - 1];
  return initialItems.join(', ') + ' and ' + lastItem;
}

function daysListToText(days: DayNumber[]): ReactNode {
  if (days.length === 0) {
    return null;
  }
  return arrayofItemsToText(days.map(day => `${convertDayNumberToDay(day)}s`));
}

function datesListToText(dates: Moment[]): ReactNode {
  if (dates.length === 0) {
    return null;
  }
  return arrayofItemsToText(dates.map(date => date.format('dddd DD MMMM')));
}

const PickUpDate = styled(Space).attrs({
  v: {
    size: 's',
    properties: [
      'margin-top',
      'margin-bottom',
      'padding-top',
      'padding-bottom',
    ],
  },
})`
  border-top: 1px solid ${props => props.theme.color('smoke')};
  border-bottom: 1px solid ${props => props.theme.color('smoke')};

  @media (min-width: 800px) {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    min-width: min(80vw, 700px);
  }
`;

const PickUpDateDescription = styled(Space).attrs({
  id: 'pick-up-date-description',
})`
  @media (min-width: 800px) {
    flex-basis: 64%;
    flex-grow: 0;
    flex-shrink: 0;
  }
`;

const PickUpDateInputWrapper = styled.div`
  flex-grow: 1;
`;

const Header = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Request = styled.form``;

const CurrentRequestCount = styled(Space).attrs({
  h: { size: 's', properties: ['padding-left', 'margin-left'] },
})`
  border-left: 5px solid ${props => props.theme.color('yellow')};
`;

const CTAs = styled(Space).attrs({
  v: { size: 'l', properties: ['margin-top'] },
})``;

const CurrentRequests: FC<{
  allowedHoldRequests: number;
  currentHoldRequests?: number;
}> = ({ allowedHoldRequests, currentHoldRequests }) =>
  typeof currentHoldRequests !== 'undefined' ? (
    <CurrentRequestCount>
      {`${currentHoldRequests}/${allowedHoldRequests} item${
        currentHoldRequests !== 1 ? 's' : ''
      } requested`}
    </CurrentRequestCount>
  ) : null;

type Props = {
  work: Work;
  item: PhysicalItem;
  isActive: boolean;
  onSuccess: () => void;
  setIsActive: (value: boolean) => void;
  openButtonRef: MutableRefObject<HTMLButtonElement | null>;
  initialHoldNumber?: number;
};

type RequestDialogProps = {
  work: Work;
  item: PhysicalItem;
  confirmRequest: (date?: Moment) => void;
  setIsActive: (value: boolean) => void;
  currentHoldNumber?: number;
};

const RequestDialog: FC<RequestDialogProps> = ({
  work,
  item,
  confirmRequest,
  setIsActive,
  currentHoldNumber,
}) => {
  const { enablePickUpDate } = useToggles();
  const availableDates = useAvailableDates();
  const [pickUpDate, setPickUpDate] = useState<string | undefined>();

  const regularClosedDaysText = daysListToText(availableDates.closedDays);
  const exceptionalClosedDatesText = datesListToText(
    availableDates.exceptionalClosedDates.filter(
      date =>
        date.isBetween(
          availableDates.nextAvailable,
          availableDates.lastAvailable,
          'day',
          '[]'
        ) // 'day' is for granularity, [] means inclusive (https://momentjscom.readthedocs.io/en/latest/moment/05-query/06-is-between/)
    )
  );

  let availableDatesText = '';
  if (availableDates.nextAvailable && availableDates.lastAvailable) {
    availableDatesText += `You can choose a date between ${availableDates.nextAvailable.format(
      'dddd DD MMMM'
    )} and ${availableDates.lastAvailable.format('dddd DD MMMM')}.`;
  }
  if (regularClosedDaysText) {
    availableDatesText += ` Please bear in mind the library is closed on ${regularClosedDaysText}`;
    if (exceptionalClosedDatesText) {
      availableDatesText += ` and will also be closed on ${exceptionalClosedDatesText}.`;
    } else {
      availableDatesText += '.';
    }
  }

  function handleConfirmRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const pickUpDateMoment = pickUpDate
      ? londonFromFormat(pickUpDate, 'DD-MM-YYYY')
      : availableDates.nextAvailable || london();
    if (
      !enablePickUpDate ||
      Boolean(
        pickUpDateMoment &&
          pickUpDateMoment.isValid() &&
          isRequestableDate({
            date: pickUpDateMoment,
            startDate: availableDates.nextAvailable,
            endDate: availableDates.lastAvailable,
            excludedDates: availableDates.exceptionalClosedDates,
            excludedDays: availableDates.closedDays,
          })
      )
    ) {
      trackEvent({
        category: 'requesting',
        action: 'confirm_request',
        label: `/works/${work.id}`,
      });
      confirmRequest(enablePickUpDate ? pickUpDateMoment : undefined);
    }
  }

  return (
    <Request onSubmit={handleConfirmRequest}>
      <Header>
        <span className={`h2`}>Request item</span>
        <CurrentRequests
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

      {enablePickUpDate && (
        <Space v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}>
          <PickUpDate>
            <PickUpDateDescription>
              <p className="no-margin">
                The date you would like to view this item in the library
                <span className="visually-hidden">
                  in the format DD/MM/YYYY
                </span>
              </p>
              <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                <p
                  className={classNames({
                    [font('hnr', 6)]: true,
                  })}
                >
                  Item requests need to be placed by 10am the day before your
                  visit
                </p>
                <p
                  className={classNames({
                    [font('hnr', 6)]: true,
                    'no-margin': true,
                  })}
                >
                  {availableDatesText}
                </p>
              </Space>
            </PickUpDateDescription>
            <PickUpDateInputWrapper>
              <RequestingDayPicker
                startDate={availableDates.nextAvailable}
                endDate={availableDates.lastAvailable}
                exceptionalClosedDates={availableDates.exceptionalClosedDates}
                regularClosedDays={availableDates.closedDays}
                pickUpDate={pickUpDate}
                setPickUpDate={setPickUpDate}
              />
            </PickUpDateInputWrapper>
          </PickUpDate>
        </Space>
      )}

      <CTAs>
        <Space
          h={{ size: 'l', properties: ['margin-right'] }}
          v={{ size: 's', properties: ['margin-bottom'] }}
          className={'inline-block'}
        >
          <ButtonSolid text={`Confirm request`} />
        </Space>
        <ButtonOutlined
          type="button"
          text={`Cancel`}
          clickHandler={() => setIsActive(false)}
        />
      </CTAs>
    </Request>
  );
};

type ConfirmedDialogProps = {
  currentHoldNumber?: number;
};

const ConfirmedDialog: FC<ConfirmedDialogProps> = ({ currentHoldNumber }) => (
  <>
    <Header>
      <span className={`h2`}>Request confirmed</span>
      <CurrentRequests
        allowedHoldRequests={allowedRequests}
        currentHoldRequests={currentHoldNumber}
      />
    </Header>
    <p>
      It will be available to pick up from the library (Rare Materials Room,
      level 3) for one week.
    </p>
    <CTAs>
      <ButtonSolidLink text={`View your library account`} link={'/account'} />
    </CTAs>
  </>
);

type ErrorDialogProps = {
  setIsActive: (value: boolean) => void;
  errorMessage: string | undefined;
};

const ErrorDialog: FC<ErrorDialogProps> = ({ setIsActive, errorMessage }) => (
  <>
    <Header>
      <span className={`h2`}>Request failed</span>
    </Header>
    <p className="no-margin">{errorMessage || defaultRequestErrorMessage}</p>
    <CTAs>
      <ButtonOutlined text={`Close`} clickHandler={() => setIsActive(false)} />
    </CTAs>
  </>
);

type RequestingState = 'initial' | 'requesting' | 'confirmed' | 'error';

const ItemRequestModal: FC<Props> = ({
  item,
  work,
  setIsActive,
  initialHoldNumber,
  onSuccess,
  openButtonRef,
  ...modalProps
}) => {
  const [requestingState, setRequestingState] = useState<RequestingState>();
  const [requestingErrorMessage, setRequestingError] = useState<string>();
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

  async function confirmRequest(date?: Moment) {
    setRequestingState('requesting');
    try {
      const response = await fetch(`/account/api/users/me/item-requests`, {
        method: 'POST',
        body: JSON.stringify({
          workId: work.id,
          itemId: item.id,
          neededBy: date?.format('YYYY-MM-DD'),
          type: 'Item',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const responseJson = (await response.json()) as CatalogueApiError;
        setRequestingState('error');
        setRequestingError(responseJson.description);
      } else {
        setRequestingState('confirmed');
        // If we get the users current holds, immediately following a successful request, the api response isn't updated quickly enough to include the new request
        // We therefore increment the currentHoldNumber manually following a successful request
        setCurrentHoldNumber(holdNumber => (holdNumber || 0) + 1);
        onSuccess();
      }
    } catch (error) {
      setRequestingState('error');
    }
  }

  function renderModalContent() {
    switch (requestingState) {
      case 'requesting':
        return <LL />;
      case 'error':
        return (
          <ErrorDialog
            setIsActive={innerSetIsActive}
            errorMessage={requestingErrorMessage}
          />
        );
      case 'confirmed':
        return <ConfirmedDialog currentHoldNumber={currentHoldNumber} />;
      case 'initial':
        return (
          <RequestDialog
            work={work}
            item={item}
            confirmRequest={confirmRequest}
            setIsActive={innerSetIsActive}
            currentHoldNumber={currentHoldNumber}
          />
        );
    }
  }

  return (
    <Modal
      {...modalProps}
      removeCloseButton={requestingState === 'requesting'}
      id="confirm-request-modal"
      setIsActive={innerSetIsActive}
      openButtonRef={openButtonRef}
    >
      <div aria-live="assertive">{renderModalContent()}</div>
    </Modal>
  );
};

export default ItemRequestModal;
