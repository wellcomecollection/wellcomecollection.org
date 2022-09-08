import { FC } from 'react';
import { DayNumber } from '@weco/common/model/opening-hours';
import CalendarSelect from '../Calendar/CalendarSelect';

type Props = {
  startDate?: Date;
  endDate?: Date;
  exceptionalClosedDates: Date[];
  regularClosedDays: DayNumber[];
  pickUpDate?: string;
  setPickUpDate: (date: string) => void;
};

const RequestingDayPicker: FC<Props> = ({
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
        min={startDate}
        max={endDate}
        excludedDates={exceptionalClosedDates}
        excludedDays={regularClosedDays}
        chosenDate={pickUpDate}
        setChosenDate={setPickUpDate}
      />
    </div>
  );
};

export default RequestingDayPicker;
