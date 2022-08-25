import { font } from '../../../utils/classnames';
import { formatDateRangeWithMessage } from '../../../utils/format-date';
import Space from '../styled/Space';
import Dot from '../Dot/Dot';
import { FC } from 'react';

type Props = {
  start: Date;
  end: Date;
  statusOverride?: string;
};

const StatusIndicator: FC<Props> = ({ start, end, statusOverride }: Props) => {
  const { color, text } = statusOverride
    ? { color: 'marble', text: statusOverride }
    : formatDateRangeWithMessage({ start, end });

  return (
    <span className={`flex flex--v-center ${font('intr', 5)}`}>
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
