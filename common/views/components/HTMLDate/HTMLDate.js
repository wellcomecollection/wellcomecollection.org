// @flow
// $FlowFixMe (ts)
import { formatDate } from '../../../utils/dates';

type Props = {|
  date: Date,
|};

const HTMLDate = ({ date }: Props) => (
  <time dateTime={date.toISOString()}>{formatDate(date)}</time>
);

export default HTMLDate;
