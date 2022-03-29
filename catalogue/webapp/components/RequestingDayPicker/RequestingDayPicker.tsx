import { FC, useState, useEffect } from 'react';
import { Moment } from 'moment';
import { DayNumber } from '@weco/common/model/opening-hours';
import { londonFromFormat } from '@weco/common/utils/format-date';
import { isRequestableDate } from '@weco/catalogue/utils/dates';
import TextInput from '@weco/common/views/components/TextInput/TextInput';

type Props = {
  startDate?: Moment;
  endDate?: Moment;
  exceptionalClosedDates: Moment[];
  regularClosedDays: DayNumber[];
  pickUpDate?: string;
  setPickUpDate: (date: string) => void;
};

const RequestingDayPicker: FC<Props> = ({
  startDate,
  endDate,
  exceptionalClosedDates,
  regularClosedDays,
  pickUpDate,
  setPickUpDate,
}: Props) => {
  const [isCorrectFormat, setIsCorrectFormat] = useState(false);
  const [isOnRequestableDate, setIsOnRequestableDate] = useState(false);
  const isValid = isCorrectFormat && isOnRequestableDate;
  const stringFormat = 'DD/MM/YYYY';

  useEffect(() => {
    const pickUpDateMoment = pickUpDate
      ? londonFromFormat(pickUpDate, stringFormat)
      : null;

    setIsCorrectFormat(
      Boolean(
        !pickUpDate || (pickUpDate && pickUpDate.match(/^\d{2}\/\d{2}\/\d{4}$/))
      )
    );

    setIsOnRequestableDate(
      Boolean(
        !pickUpDate ||
          (pickUpDateMoment &&
            pickUpDateMoment.isValid() &&
            isRequestableDate({
              date: pickUpDateMoment,
              startDate,
              endDate,
              excludedDates: exceptionalClosedDates,
              excludedDays: regularClosedDays,
            }))
      )
    );
  }, [pickUpDate]);

  return (
    <TextInput
      id={'selectDate'}
      label="Select a date"
      placeholder={stringFormat}
      value={pickUpDate || ''}
      setValue={setPickUpDate}
      isValid={isValid}
      showValidity={!isValid}
      errorMessage={
        isCorrectFormat
          ? 'Your chosen date is not available to book'
          : `Please enter a date in the correct format (${stringFormat})`
      }
      ariaDescribedBy={'pick-up-date-description'}
      required={true}
    />
  );
};

export default RequestingDayPicker;
