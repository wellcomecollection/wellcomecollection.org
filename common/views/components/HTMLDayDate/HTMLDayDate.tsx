import { FunctionComponent } from 'react';
import { formatDayDate } from '../../../utils/format-date';

type Props = {
  date: Date;
};

const HTMLDayDate: FunctionComponent<Props> = ({ date }) => (
  <time dateTime={date.toISOString()}>{formatDayDate(date)}</time>
);

export default HTMLDayDate;
