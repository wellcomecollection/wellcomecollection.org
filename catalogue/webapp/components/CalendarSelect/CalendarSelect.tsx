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
  startDate?: Date;
  endDate?: Date;
  excludedDates: Date[];
  excludedDays: DayOfWeek[];
  chosenDate?: string;
  setChosenDate: (value: string) => void;
};

function getAvailableDates(
  startDate: Date,
  endDate: Date,
  excludedDates: Date[],
  excludedDays: DayOfWeek[]
): SelectOption[] {
  return getDatesBetween({ startDate, endDate })
    .filter(date =>
      isRequestableDate({
        date,
        startDate,
        endDate,
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
  startDate,
  endDate,
  excludedDates,
  excludedDays,
  chosenDate,
  setChosenDate,
}) => {
  const availableDates =
    startDate &&
    endDate &&
    getAvailableDates(startDate, endDate, excludedDates, excludedDays);

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
