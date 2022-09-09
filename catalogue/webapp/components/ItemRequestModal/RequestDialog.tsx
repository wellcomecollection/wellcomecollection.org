import { FC, FormEvent, useState } from 'react';
import { useAvailableDates } from './useAvailableDates';
import { isRequestableDate } from '../../utils/dates';
import { trackEvent } from '@weco/common/utils/ga';
import { allowedRequests } from '@weco/common/values/requests';
import { classNames, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import RequestingDayPicker from '../RequestingDayPicker/RequestingDayPicker';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { PhysicalItem, Work } from '@weco/common/model/catalogue';
import styled from 'styled-components';
import { CTAs, CurrentRequests, Header } from './common';
import { themeValues } from '@weco/common/views/themes/config';
import { dateAsValue, dateFromValue } from './format-date';

const PickUpDate = styled(Space).attrs({
  v: {
    size: 'l',
    properties: ['padding-top', 'padding-bottom'],
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
  confirmRequest: (date: Date) => void;
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
  const availableDates = useAvailableDates();
  const [pickUpDate, setPickUpDate] = useState<string | undefined>(
    availableDates.nextAvailable && dateAsValue(availableDates.nextAvailable)
  );

  function handleConfirmRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Note: there have been issues here in the past where the date
    // can be affected by the user's timezone.
    //
    // Previously we got around this by using a vanilla Moment object;
    // when we got rid of Moment, I've tried to use UTC throughout for
    // these DD-MM-YYYY values, and hopefully they've kept those bugs at bay.
    const pickUpDateValue = pickUpDate ? dateFromValue(pickUpDate) : undefined;

    if (
      pickUpDateValue &&
      isRequestableDate({
        date: pickUpDateValue,
        startDate: availableDates.nextAvailable,
        endDate: availableDates.lastAvailable,
        excludedDates: availableDates.exceptionalClosedDates,
        excludedDays: availableDates.closedDays,
      })
    ) {
      trackEvent({
        category: 'requesting',
        action: 'confirm_request',
        label: `/works/${work.id}`,
      });
      confirmRequest(pickUpDateValue);
    }
  }

  return (
    <Request onSubmit={handleConfirmRequest}>
      <Header>
        <span className="h2">Request item</span>
        <CurrentRequests
          allowedHoldRequests={allowedRequests}
          currentHoldRequests={currentHoldNumber}
        />
      </Header>
      <p
        className={classNames({
          [font('intb', 5)]: true,
          'no-margin': true,
        })}
      >
        You are about to request the following item:
      </p>
      <Space v={{ size: 's', properties: ['margin-bottom'] }}>
        <p className={'no-margin'}>
          {work.title && <span className="block">{work.title}</span>}
          {item.title && <span>{item.title}</span>}
        </p>
      </Space>

      <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
        <PickUpDate>
          <PickUpDateDescription>
            <Space v={{ size: 's', properties: ['margin-bottom'] }}>
              <p className="no-margin">
                Select the date you would like to view this item in the library.
              </p>
            </Space>
            <p
              className={classNames({
                [font('intr', 6)]: true,
                'no-margin-l': true,
              })}
            >
              Item requests need to be placed by 10am on the working day before
              your visit. Please bear in mind the library is closed on Sundays.
            </p>
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

      <CTAs>
        <Space
          h={{ size: 'l', properties: ['margin-right'] }}
          v={{ size: 's', properties: ['margin-bottom'] }}
          className={'inline-block'}
        >
          <ButtonSolid text={`Confirm request`} />
        </Space>
        <ButtonSolid
          colors={themeValues.buttonColors.greenTransparentGreen}
          type={ButtonTypes.button}
          text={`Cancel`}
          clickHandler={() => setIsActive(false)}
        />
      </CTAs>
    </Request>
  );
};

export default RequestDialog;
