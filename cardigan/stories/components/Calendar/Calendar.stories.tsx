import { useState } from 'react';
import Calendar from '@weco/catalogue/components/Calendar/CalendarSelect';

const Template = () => {
  const [date, setDate] = useState('');

  return (
    <Calendar
      min={new Date('2002-04-01T12:00:00Z')}
      max={new Date('2002-05-08T12:00:00Z')}
      excludedDates={[
        new Date('2002-04-07T12:00:00Z'),
        new Date('2002-04-08T12:00:00Z'),
        new Date('2002-04-09T12:00:00Z'),
      ]}
      excludedDays={[0]}
      initialFocusDate={new Date('2002-04-21T12:00:00Z')}
      chosenDate={date}
      setChosenDate={setDate}
    />
  );
};

export const basic = Template.bind({});
basic.storyName = 'Calendar';
