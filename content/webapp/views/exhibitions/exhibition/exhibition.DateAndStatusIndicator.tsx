import { FunctionComponent } from 'react';

import DateRange from '@weco/common/views/components/DateRange';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import StatusIndicator from '@weco/common/views/components/StatusIndicator';
import Space from '@weco/common/views/components/styled/Space';

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
