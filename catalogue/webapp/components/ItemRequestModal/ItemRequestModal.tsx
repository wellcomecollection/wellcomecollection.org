import { FC, useState, useEffect, MutableRefObject, FormEvent } from 'react';
import { Moment } from 'moment';
import {
  OpeningHoursDay,
  ExceptionalOpeningHoursDay,
  DayNumber,
} from '@weco/common/model/opening-hours';
import { london } from '@weco/common/utils/format-date';
import { collectionVenueId } from '@weco/common/services/prismic/hardcoded-id';
import {
  determineNextAvailableDate,
  convertOpeningHoursDayToDayNumber,
  extendEndDate,
  findClosedDays,
  // isRequestableDate, // TODO prevent submisson if not requestable
} from '@weco/catalogue/utils/dates';
import { usePrismicData, useToggles } from '@weco/common/server-data/Context';
import {
  parseCollectionVenues,
  getVenueById,
} from '@weco/common/services/prismic/opening-times';
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
import { allowedRequests } from '@weco/common/values/requests';
import RequestingDayPicker from '../RequestingDayPicker/RequestingDayPicker';
import { convertDayNumberToDay } from '../../utils/dates';

function arrayofItemsToText(arr) {
  if (arr.length === 1) return arr[0];
  const initialItems = arr.slice(0, arr.length - 1);
  const lastItem = arr[arr.length - 1];
  return initialItems.join(', ') + ' and ' + lastItem;
}

function regularClosedDaysToText(regularClosedDays: DayNumber[]): string {
  const days = regularClosedDays.map(day => `${convertDayNumberToDay(day)}s`);
  return arrayofItemsToText(days);
}

function exceptionalClosedDatesToText(
  exceptionalClosedDates: Moment[]
): string {
  const dates = exceptionalClosedDates.map(date => date.format('dddd DD MMMM'));
  return arrayofItemsToText(dates);
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
    flex-basis: 84%;
  }
`;

const Header = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Request = styled.form<{ isLoading: boolean }>`
  opacity: ${props => (props.isLoading ? 0.2 : 1)};
  transition: opacity ${props => props.theme.transitionProperties};
`;

const CurrentRequestCount = styled(Space).attrs({
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
  isLoading: boolean;
  work: Work;
  item: PhysicalItem;
  confirmRequest: () => void;
  setIsActive: (value: boolean) => void;
  currentHoldNumber?: number;
};

const RequestDialog: FC<RequestDialogProps> = ({
  isLoading,
  work,
  item,
  confirmRequest,
  setIsActive,
  currentHoldNumber,
}) => {
  const { enablePickUpDate } = useToggles();
  // We get the regular and exceptional days on which the library is closed from Prismic data,
  // so we can make these unavailable in the calendar.
  const { collectionVenues } = usePrismicData();
  const venues = parseCollectionVenues(collectionVenues);
  const libraryVenue = getVenueById(venues, collectionVenueId.libraries.id);
  const regularLibraryOpeningTimes = libraryVenue?.openingHours.regular || [];
  const regularClosedDays = findClosedDays(regularLibraryOpeningTimes).map(
    day => convertOpeningHoursDayToDayNumber(day as OpeningHoursDay)
  );
  const exceptionalLibraryOpeningTimes =
    libraryVenue?.openingHours.exceptional || [];
  const exceptionalClosedDates = findClosedDays(exceptionalLibraryOpeningTimes)
    .map(day => {
      const exceptionalDay = day as ExceptionalOpeningHoursDay;
      return exceptionalDay.overrideDate as Moment;
    })
    .filter(Boolean);
  const nextAvailableDate = determineNextAvailableDate(
    london(new Date()),
    regularClosedDays
  );

  // There should be a minimum of a 2 week window in which to select a date
  const lastAvailableDate = nextAvailableDate?.clone().add(13, 'days') || null;
  // If the library is closed on any days during the selection window
  // we extend the lastAvailableDate to take these into account
  const extendedLastAvailableDate = extendEndDate({
    startDate: nextAvailableDate,
    endDate: lastAvailableDate,
    exceptionalClosedDates,
    regularClosedDays,
  });
  const [pickUpDate, setPickUpDate] = useState<string | null>(
    nextAvailableDate?.format('DD/MM/YYYY') || null // TODO or leave this empty?
  );

  const regularClosedDaysText =
    regularClosedDays.length > 0
      ? regularClosedDaysToText(regularClosedDays)
      : null;

  const exceptionalClosedDatesText =
    exceptionalClosedDates.length > 0
      ? exceptionalClosedDatesToText(exceptionalClosedDates)
      : null;

  const availableDatesText = `You can choose a date between ${nextAvailableDate?.format(
    'dddd DD MMMM'
  )} and ${extendedLastAvailableDate?.format('dddd DD MMMM')}.${
    regularClosedDaysText
      ? ` Please bear in mind the library is closed on ${regularClosedDaysText}`
      : ''
  }${
    exceptionalClosedDatesText
      ? ` and will also be closed on ${exceptionalClosedDatesText}.`
      : '.'
  }`;

  function handleConfirmRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!enablePickUpDate || pickUpDate) {
      confirmRequest();
    }
  }

  return (
    <Request isLoading={isLoading} onSubmit={handleConfirmRequest}>
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
              {/* TODO add info about which dates are/aren't available - should be used as aria-describedby for input, along with above  */}
            </PickUpDateDescription>
            <RequestingDayPicker
              startDate={nextAvailableDate}
              endDate={extendedLastAvailableDate}
              exceptionalClosedDates={exceptionalClosedDates}
              regularClosedDays={regularClosedDays}
              pickUpDate={pickUpDate}
              setPickUpDate={setPickUpDate}
            />
          </PickUpDate>
        </Space>
      )}

      <CTAs>
        <Space
          h={{ size: 'l', properties: ['margin-right'] }}
          v={{ size: 's', properties: ['margin-bottom'] }}
          className={'inline-block'}
        >
          <ButtonSolid disabled={isLoading} text={`Confirm request`} />
        </Space>
        <ButtonOutlined
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
    <BeforeYourVisit>
      <span
        className={classNames({
          [font('hnb', 5)]: true,
        })}
      >
        Before your visit:
      </span>{' '}
      you will need to book a ‘Rare Materials Room – all day entry ticket’ by
      10am the day before you wish to visit.
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

const ErrorDialog: FC<ErrorDialogProps> = ({ setIsActive }) => (
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
    setRequestingState('requesting');
    try {
      const response = await fetch(`/account/api/users/me/item-requests`, {
        method: 'POST',
        body: JSON.stringify({
          workId: work.id,
          itemId: item.id,
          type: 'Item',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        setRequestingState('error');
        // TODO: something to Sentry?
      } else {
        setRequestingState('confirmed');
        // If we get the users current holds, immediately following a successful request, the api response isn't updated quickly enough to include the new request
        // We therefore increment the currentHoldNumber manually following a successful request
        setCurrentHoldNumber(holdNumber => (holdNumber || 0) + 1);
        onSuccess();
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
        return <ConfirmedDialog currentHoldNumber={currentHoldNumber} />;
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

  return (
    <Modal
      {...modalProps}
      removeCloseButton={requestingState === 'requesting'}
      id="confirm-request-modal"
      setIsActive={innerSetIsActive}
      openButtonRef={openButtonRef}
    >
      {renderModalContent(requestingState)}
    </Modal>
  );
};

export default ItemRequestModal;
