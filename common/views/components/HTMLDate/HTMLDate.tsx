import { FunctionComponent } from 'react';
import { formatDate } from '@weco/common/utils/format-date';

type Props = {
  date: Date;
};

const HTMLDate: FunctionComponent<Props> = ({ date }) => (
  <time dateTime={date.toISOString()}>{formatDate(date)}</time>
);

export default HTMLDate;
