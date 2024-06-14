import { FunctionComponent, FormEvent, useState, useEffect } from 'react';
import { allowedRequests } from '@weco/common/values/requests';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import RequestingDayPicker from '../RequestingDayPicker/RequestingDayPicker';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import {
  PhysicalItem,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import styled from 'styled-components';
import { CTAs, CurrentRequests, Header } from './common';
import { themeValues } from '@weco/common/views/themes/config';
import { dateAsValue, dateFromValue } from './format-date';
import { today, addDays } from '@weco/common/utils/dates';

const PickUpDate = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  border-top: 1px solid ${props => props.theme.color('neutral.300')};
  border-bottom: 1px solid ${props => props.theme.color('neutral.300')};

  @media (min-width: 800px) {
    display: flex;
    justify-content: space-between;
    min-width: min(80vw, 700px);
  }
`;

const PickUpDateDescription = styled(Space).attrs({
  id: 'pick-up-date-description',
})`
  @media (min-width: 800px) {
    flex: 0 0 64%;
  }
`;

const PickUpDateInputWrapper = styled.div`
  flex-grow: 1;
`;

const ConfirmRequestButtonWrapper = styled(Space).attrs({
  $h: { size: 'l', properties: ['margin-right'] },
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  display: inline-block;
`;

const Request = styled.form``;

const WorkTitle = styled.span`
  display: block;
`;

const PickupDeadline = styled.p.attrs({
  className: font('intr', 6),
})`
  ${props => props.theme.media('large')`
    margin: 0;
  `}
`;

const ErrorMessage = styled(Space).attrs({
  as: 'p',
  $h: { size: 'm', properties: ['padding-left'] },
  $v: { size: 'm', properties: ['margin-bottom', 'margin-top'] },
})`
  border-left: 5px solid ${props => props.theme.color('validation.red')};
`;

type RequestDialogProps = {
  work: Work;
  item: PhysicalItem;
  confirmRequest: (date: Date) => void;
  setIsActive: (value: boolean) => void;
  currentHoldNumber?: number;
};

const RequestDialog: FunctionComponent<RequestDialogProps> = ({
  work,
  item,
  confirmRequest,
  setIsActive,
  currentHoldNumber,
}) => {
  const [pickUpDate, setPickUpDate] = useState<string | undefined>(
    item.availableDates && dateAsValue(new Date(item.availableDates[0].from))
  );

  // we know an item is offsite/deepstore if its 1st available date is more than 9 days in the future
  const isOffsiteDeepstoreItem =
    item.availableDates &&
    new Date(item.availableDates[0].from) > addDays(today(), 9);

  const pickupDeadline = isOffsiteDeepstoreItem
    ? 'Item requests for offsite material need to be placed by 10am, 10 working days before your visit'
    : 'Item requests need to be placed by 10am on the working day before your visit';

  // the pickUpDate's state sometimes get set as undefined before the availableDates have been fetched
  // as a result the user can't confirm the request unless they interact with the RequestingDayPicker in some way to trigger a state update
  // here we set pickUpDate when item.availableDates becomes defined
  useEffect(() => {
    if (!pickUpDate && item.availableDates) {
      setPickUpDate(dateAsValue(new Date(item.availableDates[0].from)));
    }
  }, [item.availableDates]);

  function handleConfirmRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Note: there have been issues here in the past where the date
    // can be affected by the user's timezone.
    //
    // Previously we got around this by using a vanilla Moment object;
    // when we got rid of Moment, I've tried to use UTC throughout for
    // these DD-MM-YYYY values, and hopefully they've kept those bugs at bay.
    const pickUpDateValue = pickUpDate ? dateFromValue(pickUpDate) : undefined;

    if (pickUpDateValue) {
      confirmRequest(pickUpDateValue);
    }
  }

  return (
    <Request onSubmit={handleConfirmRequest}>
      <Header>
        <span className={font('wb', 3)}>Request item</span>
        <CurrentRequests
          allowedHoldRequests={allowedRequests}
          currentHoldRequests={currentHoldNumber}
        />
      </Header>
      <p className={font('intb', 5)} style={{ marginBottom: 0 }}>
        You are about to request the following item:
      </p>
      <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
        <p style={{ marginBottom: 0 }}>
          {work.title && <WorkTitle>{work.title}</WorkTitle>}
          {item.title && <span>{item.title}</span>}
        </p>
      </Space>

      <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
        <PickUpDate>
          <PickUpDateDescription>
            <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
              <p style={{ marginBottom: 0 }}>
                Select the date you would like to view this item in the library.
              </p>
            </Space>
            <PickupDeadline>
              <span data-testid="pickup-deadline">
                {`${pickupDeadline}. Please bear in mind the library is closed on Sundays.`}
              </span>
            </PickupDeadline>
          </PickUpDateDescription>
          <PickUpDateInputWrapper>
            {item.availableDates?.length ? (
              <RequestingDayPicker
                availableDates={item.availableDates}
                pickUpDate={pickUpDate}
                setPickUpDate={setPickUpDate}
              />
            ) : (
              <ErrorMessage>
                Error fetching available dates.
                <br />
                Try again later or email us at
                <br />
                <a href="mailto:digital@wellcomecollection.org">
                  digital@wellcomecollection.org
                </a>
              </ErrorMessage>
            )}
          </PickUpDateInputWrapper>
        </PickUpDate>
      </Space>

      <CTAs>
        <ConfirmRequestButtonWrapper>
          <Button
            variant="ButtonSolid"
            text="Confirm request"
            dataGtmTrigger="requesting_confirm"
            disabled={!item.availableDates?.length}
          />
        </ConfirmRequestButtonWrapper>
        <Button
          variant="ButtonSolid"
          colors={themeValues.buttonColors.greenTransparentGreen}
          type={ButtonTypes.button}
          text="Cancel"
          clickHandler={() => setIsActive(false)}
        />
      </CTAs>
    </Request>
  );
};

export default RequestDialog;
