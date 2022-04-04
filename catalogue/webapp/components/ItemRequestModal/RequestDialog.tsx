import { FC, FormEvent, ReactNode, useState } from 'react';
import { useAvailableDates } from './useAvailableDates';
import { convertDayNumberToDay, isRequestableDate } from '../../utils/dates';
import { london, londonFromFormat } from '@weco/common/utils/format-date';
import { trackEvent } from '@weco/common/utils/ga';
import { allowedRequests } from '@weco/common/values/requests';
import { classNames, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import RequestingDayPicker from '../RequestingDayPicker/RequestingDayPicker';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { PhysicalItem, Work } from '@weco/common/model/catalogue';
import { useToggles } from '@weco/common/server-data/Context';
import { DayNumber } from '@weco/common/model/opening-hours';
import styled from 'styled-components';
import { Moment } from 'moment';
import { CTAs, CurrentRequests, Header } from './common';

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

const Request = styled.form``;

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

export default RequestDialog;
