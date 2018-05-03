// @flow
import {font, spacing} from '../../../utils/classnames';
import {formatDateRangeWithMessage} from '../../../utils/format-date';
import Icon from '../Icon/Icon';

type Props = {|
  start: Date,
  end: Date
|}

const StatusIndicator = ({ start, end }: Props) => {
  const {color, text} = formatDateRangeWithMessage({start, end});
  return (
    <span className={`flex flex--v-center ${font({s: 'HNM4'})}`}>
      <span className={`${spacing({s: 1}, {margin: ['right']})} flex flex--v-center`}>
        <Icon name='statusIndicator' extraClasses={`icon--match-text icon--${color}`} />
      </span>
      <span>{text}</span>
    </span>
  );
};

export default StatusIndicator;
