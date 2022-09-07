import { useState } from 'react';
import Calendar from '@weco/catalogue/components/Calendar/CalendarSelect';
import { london } from '@weco/common/utils/format-date';

const Template = () => {
  const [date, setDate] = useState('');

  return (
    <Calendar
      min={london('2002-04-01T12:00:00Z')}
      max={london('2002-05-08T12:00:00Z')}
      excludedDates={[
        london('2002-04-07T12:00:00Z'),
        london('2002-04-08T12:00:00Z'),
        london('2002-04-09T12:00:00Z'),
      ]}
      excludedDays={[0]}
      initialFocusDate={london('2002-04-21T12:00:00Z')}
      chosenDate={date}
      setChosenDate={setDate}
    />
  );
};

export const basic = Template.bind({});
basic.storyName = 'Calendar';
