import {Fragment} from 'react';
import moment from 'moment';
import { storiesOf } from '@storybook/react';
import {sized} from '../../../common/utils/style';
import DateRange from '../../../common/views/components/DateRange/DateRange';

const stories = storiesOf('Components', module);
stories
  .add('Date ranges', () => {
    return (
      <Fragment>
        <h2 className='h2'>Same day</h2>
        <DateRange start={moment()} end={moment().add(1, 'hour')} />
        <hr style={{
          marginTop: sized(3),
          marginBottom: sized(3)
        }} />
        <h2 className='h2 s1-margin-top'>Across multiple days</h2>
        <DateRange start={moment()} end={moment().add(1, 'week')} />
      </Fragment>
    );
  });
