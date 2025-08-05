// eslint-data-component: intentionally omitted
import { FunctionComponent } from 'react';

import {
  formatDate,
  formatDayDate,
  formatTime,
} from '@weco/common/utils/format-date';

type Props = {
  date: Date;
};

export const HTMLDate: FunctionComponent<Props> = ({ date }) => (
  <time dateTime={date.toISOString()}>{formatDate(date)}</time>
);

export const HTMLDayDate: FunctionComponent<Props> = ({ date }) => (
  <time dateTime={date.toISOString()}>{formatDayDate(date)}</time>
);

export const HTMLTime: FunctionComponent<Props> = ({ date }) => (
  <time dateTime={date.toISOString()}>{formatTime(date)}</time>
);
