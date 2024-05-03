import { FunctionComponent } from 'react';
import NewCalendarSelect from '../CalendarSelect/NewCalendarSelect';
import { AvailabilitySlot } from '@weco/content/services/wellcome/catalogue/types';

type Props = {
  availableDates: AvailabilitySlot[];
  pickUpDate?: string;
  setPickUpDate: (date: string) => void;
};

const NewRequestingDayPicker: FunctionComponent<Props> = ({
  availableDates,
  pickUpDate,
  setPickUpDate,
}: Props) => {
  return (
    <div style={{ position: 'relative' }}>
      <NewCalendarSelect
        availableDates={availableDates}
        chosenDate={pickUpDate}
        setChosenDate={setPickUpDate}
      />
    </div>
  );
};

export default NewRequestingDayPicker;
