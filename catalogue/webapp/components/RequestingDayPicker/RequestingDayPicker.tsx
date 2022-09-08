import { FC } from 'react';
import { DayNumber } from '@weco/common/model/opening-hours';
import CalendarSelect from '../Calendar/CalendarSelect';
import { london } from 'utils/format-date';

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
        min={london(startDate)}
        max={london(endDate)}
        excludedDates={exceptionalClosedDates.map(d => london(d))}
        excludedDays={regularClosedDays}
        chosenDate={pickUpDate}
        setChosenDate={setPickUpDate}
      />
    </div>
  );
};

export default RequestingDayPicker;
