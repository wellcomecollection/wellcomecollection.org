import { FC, useState, useEffect } from 'react';
import { Moment } from 'moment';
import { DayNumber } from '@weco/common/model/opening-hours';
import { londonFromFormat } from '@weco/common/utils/format-date';
import { isRequestableDate } from '@weco/catalogue/utils/dates';
import TextInput from '@weco/common/views/components/TextInput/TextInput';

type Props = {
  startDate: Moment | null;
  endDate: Moment | null;
  exceptionalClosedDates: Moment[];
  regularClosedDays: DayNumber[];
  pickUpDate: string | null;
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

  useEffect(() => {
    const pickUpDateMoment = pickUpDate
      ? londonFromFormat(pickUpDate, 'DD-MM-YYYY')
      : null;

    setIsCorrectFormat(
      Boolean(pickUpDate && pickUpDate.match(/^\d{2}\/\d{2}\/\d{4}$/))
    );

    setIsOnRequestableDate(
      Boolean(
        pickUpDateMoment &&
          pickUpDateMoment.isValid() &&
          isRequestableDate({
            date: pickUpDateMoment,
            startDate,
            endDate,
            excludedDates: exceptionalClosedDates,
            excludedDays: regularClosedDays,
          })
      )
    );
  }, [pickUpDate]);

  return (
    <TextInput
      id={'selectDate'}
      label="Select a date"
      value={pickUpDate || ''}
      setValue={setPickUpDate}
      isValid={isValid}
      showValidity={!isValid}
      errorMessage={
        isCorrectFormat
          ? 'Your chosen date is not available to book'
          : 'Please enter a date in the correct format (dd/mm/yyyy)'
      }
      ariaDescribedBy={'pick-up-date-description'}
    />
  );
};

export default RequestingDayPicker;
