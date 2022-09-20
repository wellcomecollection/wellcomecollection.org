import { font } from '@weco/common/utils/classnames';
import { formatDateRangeWithMessage } from '@weco/common/utils/format-date';
import Space from '@weco/common/views/components/styled/Space';
import Dot from '@weco/common/views/components/Dot/Dot';
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
        className="flex flex--v-center"
      >
        <Dot color={color} />
      </Space>
      <span>{text}</span>
    </span>
  );
};

export default StatusIndicator;
