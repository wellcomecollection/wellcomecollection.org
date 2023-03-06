import { FunctionComponent } from 'react';
import Select, {
  SelectOption,
} from '@weco/common/views/components/Select/Select';
import { isRequestableDate } from '../../utils/dates';
import { getDatesBetween } from '@weco/common/utils/dates';
import { dateAsValue } from '../ItemRequestModal/format-date';
import {
  formatDayName,
  formatDayMonth,
  DayOfWeek,
} from '@weco/common/utils/format-date';

type Props = {
  min?: Date;
  max?: Date;
  excludedDates: Date[];
  excludedDays: DayOfWeek[];
  chosenDate?: string;
  setChosenDate: (value: string) => void;
};

function getAvailableDates(
  min: Date,
  max: Date,
  excludedDates: Date[],
  excludedDays: DayOfWeek[]
): SelectOption[] {
  const days = getDatesBetween({ start: min, end: max });

  return days
    .filter(date =>
      isRequestableDate({
        date,
        startDate: min,
        endDate: max,
        excludedDates,
        excludedDays,
      })
    )
    .map(date => ({
      value: dateAsValue(date),
      text: `${formatDayName(date)} ${formatDayMonth(date)}`,
    }));
}

const CalendarSelect: FunctionComponent<Props> = ({
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
      name="calendar_dates"
      label="Select a date"
      hideLabel={true}
      options={availableDates}
      value={chosenDate || 'Select a date'}
      onChange={e => setChosenDate(e.target.value)}
    />
  ) : null;
};

export default CalendarSelect;
