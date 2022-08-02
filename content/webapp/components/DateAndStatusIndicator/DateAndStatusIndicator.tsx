import { FC, Fragment } from 'react';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  start: Date;
  end?: Date;
};

const DateAndStatusIndicator: FC<Props> = ({ start, end }: Props) => (
  <Fragment>
    <Space v={{ size: 's', properties: ['margin-bottom'] }}>
      {end ? (
        <DateRange start={new Date(start)} end={new Date(end)} />
      ) : (
        <HTMLDate date={new Date(start)} />
      )}
    </Space>
    <StatusIndicator start={start} end={end || new Date()} />
  </Fragment>
);
export default DateAndStatusIndicator;
