// @flow
// $FlowFixMe (ts)
import { font } from '../../../utils/classnames';
// $FlowFixMe (ts)
import { formatDateRangeWithMessage } from '../../../utils/dates';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
// $FlowFixMe (tsx)
import Dot from '../Dot/Dot';

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
    <span className={`flex flex--v-center ${font('hnr', 5)}`}>
      <Space
        as="span"
        h={{ size: 'xs', properties: ['margin-right'] }}
        className={`flex flex--v-center`}
      >
        <Dot color={color} />
      </Space>
      <span>{text}</span>
    </span>
  );
};

export default StatusIndicator;
