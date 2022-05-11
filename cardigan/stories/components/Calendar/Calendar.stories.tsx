import { useState } from 'react';
import Calendar from '@weco/catalogue/components/Calendar/CalendarSelect';
import { london } from '@weco/common/utils/format-date';

const Template = () => {
  const [date, setDate] = useState('');

  return (
    <Calendar
      min={london('2002-04-01')}
      max={london('2002-05-08')}
      excludedDates={[
        london('2002-04-07'),
        london('2002-04-08'),
        london('2002-04-09'),
      ]}
      excludedDays={[0]}
      initialFocusDate={london('2002-04-21')}
      chosenDate={date}
      setChosenDate={setDate}
    />
  );
};

export const basic = Template.bind({});
basic.storyName = 'Calendar';
