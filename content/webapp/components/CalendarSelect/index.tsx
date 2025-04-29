import { FunctionComponent } from 'react';

import { formatDayMonth, formatDayName } from '@weco/common/utils/format-date';
import { dateAsValue } from '@weco/content/components/ItemRequestModal/format-date';
import Select from '@weco/content/components/Select';
import { AvailabilitySlot } from '@weco/content/services/wellcome/catalogue/types';

type Props = {
  availableDates: AvailabilitySlot[];
  chosenDate?: string;
  setChosenDate: (value: string) => void;
};

const availabilitySlotsToSelectOptions = (
  availableDates: AvailabilitySlot[]
) => {
  // AvailabilitySlots have open and close dateTimestamps
  // right now we only care about the day, not the time
  // so we're only using "from" = opening date/time
  return (
    availableDates
      .map(availabilitySlot => new Date(availabilitySlot.from))
      .map(availableDate => ({
        value: dateAsValue(availableDate),
        text: `${formatDayName(availableDate)} ${formatDayMonth(
          availableDate
        )}`,
      }))
      // the list of available dates is returned from the itemsAPI in various lenghts
      // trimming down to 12
      .slice(0, 12)
  );
};

const CalendarSelect: FunctionComponent<Props> = ({
  availableDates,
  chosenDate,
  setChosenDate,
}) => (
  <Select
    name="calendar_dates"
    label="Select a date"
    hideLabel={true}
    options={availabilitySlotsToSelectOptions(availableDates)}
    value={chosenDate || 'Select a date'}
    onChange={e => setChosenDate(e.target.value)}
  />
);

export default CalendarSelect;
