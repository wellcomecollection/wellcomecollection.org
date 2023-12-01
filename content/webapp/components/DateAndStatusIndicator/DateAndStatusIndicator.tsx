import { FunctionComponent } from 'react';
import DateRange from '@weco/content/components/DateRange/DateRange';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import StatusIndicator from '../../components/StatusIndicator/StatusIndicator';
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
