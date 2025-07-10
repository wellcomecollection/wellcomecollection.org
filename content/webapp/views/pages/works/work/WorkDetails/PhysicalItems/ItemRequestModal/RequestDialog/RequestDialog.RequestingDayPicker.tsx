import { FunctionComponent } from 'react';

import { formatDayMonth, formatDayName } from '@weco/common/utils/format-date';
import { AvailabilitySlot } from '@weco/content/services/wellcome/catalogue/types';
import Select from '@weco/content/views/components/Select';
import { dateAsValue } from '@weco/content/views/pages/works/work/WorkDetails/PhysicalItems/ItemRequestModal/ItemRequestModal.helpers';

type Props = {
  availableDates: AvailabilitySlot[];
  pickUpDate?: string;
  setPickUpDate: (date: string) => void;
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

const RequestingDayPicker: FunctionComponent<Props> = ({
  availableDates,
  pickUpDate,
  setPickUpDate,
}: Props) => {
  return (
    <div style={{ position: 'relative' }}>
      <Select
        name="calendar_dates"
        label="Select a date"
        hideLabel={true}
        options={availabilitySlotsToSelectOptions(availableDates)}
        value={pickUpDate || 'Select a date'}
        onChange={e => setPickUpDate(e.target.value)}
      />
    </div>
  );
};

export default RequestingDayPicker;
