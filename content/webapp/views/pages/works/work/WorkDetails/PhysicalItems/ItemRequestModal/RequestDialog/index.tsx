import { FormEvent, FunctionComponent, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';

import { itemRequestDialog } from '@weco/common/data/microcopy';
import { font } from '@weco/common/utils/classnames';
import { formatDayMonth, formatDayName } from '@weco/common/utils/format-date';
import { allowedRequests } from '@weco/common/values/requests';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import {
  PhysicalItem,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import CurrentRequests from '@weco/content/views/pages/works/work/WorkDetails/PhysicalItems/ItemRequestModal/ItemRequestModal.CurrentRequests';
import {
  dateAsValue,
  dateFromValue,
} from '@weco/content/views/pages/works/work/WorkDetails/PhysicalItems/ItemRequestModal/ItemRequestModal.helpers';
import {
  CTAs,
  Header,
} from '@weco/content/views/pages/works/work/WorkDetails/PhysicalItems/ItemRequestModal/ItemRequestModal.styles';

import RequestingDayPicker from './RequestDialog.RequestingDayPicker';

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
  className: font('sans', -2),
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
  pickUpDate?: string;
  setPickUpDate: (date: string) => void;
};

const RequestDialog: FunctionComponent<RequestDialogProps> = ({
  work,
  item,
  confirmRequest,
  setIsActive,
  currentHoldNumber,
  pickUpDate,
  setPickUpDate,
}) => {
  const theme = useTheme();
  const firstAvailableDate =
    item.availableDates &&
    `${formatDayName(new Date(item.availableDates[0].from))} ${formatDayMonth(
      new Date(item.availableDates[0].from)
    )}`;

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
        <span className={font('brand', 1)}>Request item</span>
        <CurrentRequests
          allowedHoldRequests={allowedRequests}
          currentHoldRequests={currentHoldNumber}
        />
      </Header>
      <p className={font('sans-bold', -1)} style={{ marginBottom: 0 }}>
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
                {itemRequestDialog.pickupItemOn} <b>{firstAvailableDate}</b>.
                <br />
              </span>
              {itemRequestDialog.libraryClosedOnSunday}
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
            dataGtmProps={{
              trigger: 'requesting_confirm',
            }}
            disabled={!item.availableDates?.length}
          />
        </ConfirmRequestButtonWrapper>
        <Button
          variant="ButtonSolid"
          colors={theme.buttonColors.greenTransparentGreen}
          type={ButtonTypes.button}
          text="Cancel"
          clickHandler={() => setIsActive(false)}
        />
      </CTAs>
    </Request>
  );
};

export default RequestDialog;
