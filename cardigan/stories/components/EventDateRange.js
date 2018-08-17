import {Fragment} from 'react';
import moment from 'moment';
import { storiesOf } from '@storybook/react';
import { withKnobs, date } from '@storybook/addon-knobs/react';
import EventDateRange from '../../../common/views/components/EventDateRange/EventDateRange';
import Readme from '../../../common/views/components/EventDateRange/README.md';

function dateKnob(name, defaultValue) {
  const stringTimestamp = date(name, defaultValue);
  return new Date(stringTimestamp);
}

const stories = storiesOf('Components', module);
stories
  .addDecorator(withKnobs)
  .add('Event date range', () => {
    const firstDate = moment().subtract(2, 'day').toDate();
    const secondDate = moment().add(1, 'minute').toDate();
    const thirdDate = moment().add(1, 'day').toDate();

    const times = [{
      range: {
        startDateTime: dateKnob('First date', firstDate),
        endDateTime: moment(firstDate).add(1, 'day').toDate()
      }
    }, {
      range: {
        startDateTime: dateKnob('Second date', secondDate),
        endDateTime: moment(secondDate).add(1, 'day').toDate()
      }
    }, {
      range: {
        startDateTime: dateKnob('Third date', thirdDate),
        endDateTime: moment(thirdDate).add(1, 'day').toDate()
      }
    }];
    return (
      <Fragment>
        <EventDateRange event={{ times }} />
      </Fragment>
    );
  }, {info: Readme});
