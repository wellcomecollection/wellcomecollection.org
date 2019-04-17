import { storiesOf } from '@storybook/react';
import { useEffect, useState } from 'react';
import EventSchedule from '../../../common/views/components/EventSchedule/EventSchedule';
import readme from '../../../common/views/components/EventSchedule/README.md';
import { getEvent } from '../../../common/services/prismic/events';

const stories = storiesOf('Components', module);

const EventScheduleData = ({ children }) => {
  const [schedule, setSchedule] = useState();

  useEffect(() => {
    getEvent(null, { id: 'XHZdDRAAAHJe9rx9' }).then(event => {
      setSchedule(event.schedule);
    });
  }, []);

  return children(schedule);
};

const EventScheduleExample = () => (
  <EventScheduleData>
    {schedule => (
      <>
        {schedule ? (
          <ul className="plain-list no-margin no-padding">
            <EventSchedule schedule={schedule} />
          </ul>
        ) : (
          <p>loading…</p>
        )}
      </>
    )}
  </EventScheduleData>
);

stories.add('EventSchedule', EventScheduleExample, { info: readme });
