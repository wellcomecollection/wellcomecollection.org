import { DayOfWeek } from '@weco/common/utils/format-date';
import { FunctionComponent } from 'react';
import CalendarSelect from '../CalendarSelect/CalendarSelect';

type Props = {
  startDate?: Date;
  endDate?: Date;
  exceptionalClosedDates: Date[];
  regularClosedDays: DayOfWeek[];
  pickUpDate?: string;
  setPickUpDate: (date: string) => void;
};

const RequestingDayPicker: FunctionComponent<Props> = ({
  startDate,
  endDate,
  exceptionalClosedDates,
  regularClosedDays,
  pickUpDate,
  setPickUpDate,
}: Props) => {
  return (
    <div style={{ position: 'relative' }}>
      <CalendarSelect
        startDate={startDate}
        endDate={endDate}
        excludedDates={exceptionalClosedDates}
        excludedDays={regularClosedDays}
        chosenDate={pickUpDate}
        setChosenDate={setPickUpDate}
      />
    </div>
  );
};

export default RequestingDayPicker;
