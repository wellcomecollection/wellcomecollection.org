import { FC } from 'react';
import Select, {
  SelectOption,
} from '@weco/common/views/components/Select/Select';
import { Moment } from 'moment';
import { DayNumber } from '@weco/common/model/opening-hours';
import { isRequestableDate } from '../../utils/dates';
import { isTruthy } from '@weco/common/utils/array';

type Props = {
  min?: Moment;
  max?: Moment;
  excludedDates: Moment[];
  excludedDays: DayNumber[];
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
          value: date.format('DD-MM-YYYY'),
          text: date.format('dddd D MMMM'),
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
  const canGetDates = min && max;
  const availableDates =
    canGetDates && getAvailableDates(min, max, excludedDates, excludedDays);

  return availableDates ? (
    <Select
      name={`calendar_dates`}
      label={`Select a date`}
      hideLabel={true}
      options={availableDates}
      value={chosenDate || 'Select a date'}
      onChange={e => setChosenDate(e.target.value)}
    />
  ) : null;
};

export default Calendar;
