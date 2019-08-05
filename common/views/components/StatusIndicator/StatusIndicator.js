// @flow
import { font } from '../../../utils/classnames';
import { formatDateRangeWithMessage } from '../../../utils/format-date';
import Icon from '../Icon/Icon';

type Props = {|
  start: Date,
  end: Date,
  statusOverride?: ?string,
|};

const StatusIndicator = ({ start, end, statusOverride }: Props) => {
  const { color, text } = statusOverride
    ? { color: 'marble', text: statusOverride }
    : formatDateRangeWithMessage({ start, end });
  return (
    <span className={`flex flex--v-center ${font('hnl', 6)}`}>
      <span className={`margin-right-6 flex flex--v-center`}>
        <Icon
          name="statusIndicator"
          extraClasses={`icon--match-text icon--${color}`}
        />
      </span>
      <span>{text}</span>
    </span>
  );
};

export default StatusIndicator;
