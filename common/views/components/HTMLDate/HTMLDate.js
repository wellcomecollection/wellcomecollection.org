// @flow
import {formatDate} from '../../../utils/format-date';

type Props = {|
  date: Date
|}

const HTMLDate = ({ date }: Props) => (
  <time dateTime={date.toISOString()}>{formatDate(date)}</time>
);

export default HTMLDate;
