import { FunctionComponent } from 'react';
import { formatTime } from '../../../utils/format-date';

type Props = {
  date: Date;
};

const HTMLTime: FunctionComponent<Props> = ({ date }) => (
  <time dateTime={date.toISOString()}>{formatTime(date)}</time>
);

export default HTMLTime;
