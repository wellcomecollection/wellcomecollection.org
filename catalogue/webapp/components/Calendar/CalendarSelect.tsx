import { FC } from 'react';
import Select, {
  SelectOption,
} from '@weco/common/views/components/Select/Select';
import { Moment } from 'moment';
import { DayNumber } from '@weco/common/model/opening-hours';
import { isRequestableDate } from '../../utils/dates';
import { isTruthy } from '@weco/common/utils/array';

type Props = {
  min: Moment;
  max: Moment;
  excludedDates: Moment[];
  excludedDays: DayNumber[];
  initialFocusDate: Moment;
  chosenDate?: string;
  setChosenDate: (value: string) => void;
};

function getAvailableDates(
  min: Moment,
  max: Moment,
  excludedDates: Moment[],
  excludedDays: DayNumber[]
): SelectOption[] {
  const rangeNumber = max.diff(min, 'days') + 1;
  return [...Array(rangeNumber).keys()]
    .map(n => min.clone().add(n, 'days'))
    .map(date => {
      return (
        isRequestableDate({
          date,
          startDate: min,
          endDate: max,
          excludedDates,
          excludedDays,
        }) && {
          value: date.format('YYYY-MM-DD'),
          text: date.format('dddd Do MMMM'),
        }
      );
    })
    .filter(isTruthy);
}

const Calendar: FC<Props> = ({
  min,
  max,
  excludedDates,
  excludedDays,
  chosenDate,
  setChosenDate,
}) => {
  const availableDates = getAvailableDates(
    min,
    max,
    excludedDates,
    excludedDays
  );

  return (
    <Select
      name={`calendar dates`}
      label={`available dates`}
      options={availableDates}
      value={chosenDate || 'Select a date'}
      onChange={e => setChosenDate(e.target.value)}
    />
  );
};

export default Calendar;
