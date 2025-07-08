import { FunctionComponent } from 'react';

import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import Space from '@weco/common/views/components/styled/Space';
import DateRange from '@weco/content/views/components/DateRange';
import StatusIndicator from '@weco/content/views/components/StatusIndicator';

type Props = {
  start: Date;
  end?: Date;
};

const DateAndStatusIndicator: FunctionComponent<Props> = ({ start, end }) => (
  <>
    <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
      {end ? <DateRange start={start} end={end} /> : <HTMLDate date={start} />}
    </Space>
    <StatusIndicator start={start} end={end || new Date()} />
  </>
);
export default DateAndStatusIndicator;
