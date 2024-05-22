import { FunctionComponent } from 'react';
import CalendarSelect from '../CalendarSelect/CalendarSelect';
import { AvailabilitySlot } from '@weco/content/services/wellcome/catalogue/types';

type Props = {
  availableDates: AvailabilitySlot[];
  pickUpDate?: string;
  setPickUpDate: (date: string) => void;
};

const RequestingDayPicker: FunctionComponent<Props> = ({
  availableDates,
  pickUpDate,
  setPickUpDate,
}: Props) => {
  return (
    <div style={{ position: 'relative' }}>
      <CalendarSelect
        availableDates={availableDates}
        chosenDate={pickUpDate}
        setChosenDate={setPickUpDate}
      />
    </div>
  );
};

export default RequestingDayPicker;
