import { FC, useState } from 'react';
import Select from '@weco/common/views/components/Select/Select';
import { Moment } from 'moment';
import { DayNumber } from '@weco/common/model/opening-hours';
import { getCalendarRows } from './calendar-utils';
import { isRequestableDate } from '../../utils/dates';

type Props = {
  min: Moment;
  max: Moment;
  excludedDates: Moment[];
  excludedDays: DayNumber[];
  initialFocusDate: Moment;
  chosenDate: string | undefined;
  setChosenDate: (value: string) => void;
};

const Calendar: FC<Props> = ({
  min,
  max,
  excludedDates,
  excludedDays,
  initialFocusDate,
  chosenDate,
  setChosenDate,
}) => {
  const [tabbableDate] = useState(initialFocusDate);
  const rows = tabbableDate ? getCalendarRows(tabbableDate) : [];
  const availableDates = rows
    .map(row =>
      row
        .map(
          date =>
            isRequestableDate({
              date,
              startDate: min,
              endDate: max,
              excludedDates,
              excludedDays,
            }) && date.format('YYYY-MM-DD')
        )
        .filter(Boolean)
    )
    .filter(Boolean)
    .flat()
    .map(d => {
      return {
        value: d || '',
        text: d || '',
      };
    });

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
