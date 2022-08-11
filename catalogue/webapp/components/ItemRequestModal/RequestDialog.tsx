import { FC, FormEvent, useState } from 'react';
import { useAvailableDates } from './useAvailableDates';
import { isRequestableDate } from '../../utils/dates';
import { trackEvent } from '@weco/common/utils/ga';
import { allowedRequests } from '@weco/common/values/requests';
import { classNames, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import RequestingDayPicker from '../RequestingDayPicker/RequestingDayPicker';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { PhysicalItem, Work } from '@weco/common/model/catalogue';
import styled from 'styled-components';
import moment, { Moment } from 'moment';
import { CTAs, CurrentRequests, Header } from './common';

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
  const availableDates = useAvailableDates();
  const [pickUpDate, setPickUpDate] = useState<string | undefined>(
    availableDates.nextAvailable?.format('DD-MM-YYYY')
  );

  function handleConfirmRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const pickUpDateMoment = pickUpDate
      ? moment(pickUpDate, 'DD-MM-YYYY')
      : undefined;
    // NB. We want a moment object that represents the selected date
    // We previously were previously using a moment with a London timzone here,
    // which could erroneously change the date depending on the timezone the user was in.

    if (
      pickUpDateMoment &&
      pickUpDateMoment.isValid() &&
      isRequestableDate({
        date: pickUpDateMoment,
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
      confirmRequest(pickUpDateMoment);
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
                [font('hnr', 6)]: true,
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
