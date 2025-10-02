// eslint-data-component: intentionally omitted
import { FunctionComponent } from 'react';

import {
  formatDate,
  formatDayDate,
  formatTime,
} from '@weco/common/utils/format-date';

type Props = {
  date: Date;
  variant: 'date' | 'dayDate' | 'time';
};

const DateVariant = ({ date, variant }: Props) => {
  switch (variant) {
    case 'date':
      return <>{formatDate(date)}</>;
    case 'dayDate':
      return <>{formatDayDate(date)}</>;
    case 'time':
      return <>{formatTime(date)}</>;
    default:
      return null;
  }
};

const HTMLDateAndTime: FunctionComponent<Props> = ({
  date,
  variant,
}: Props) => {
  return (
    <time dateTime={date.toISOString()}>
      <DateVariant date={date} variant={variant} />
    </time>
  );
};

export default HTMLDateAndTime;
