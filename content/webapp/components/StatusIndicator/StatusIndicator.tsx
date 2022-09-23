import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Dot from '@weco/common/views/components/Dot/Dot';
import { FC } from 'react';
import { isFuture, isPast, isSameDay } from '@weco/common/utils/dates';

type Props = {
  start: Date;
  end: Date;
  statusOverride?: string;
};

export function formatDateRangeWithMessage({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): { text: string; color: string } {
  const today = new Date();

  const sevenDaysTime = new Date();
  sevenDaysTime.setDate(sevenDaysTime.getDate() + 7);

  const closesToday = isSameDay(end, today);
  const closesInSevenDays = today < end && end < sevenDaysTime;

  if (!isSameDay(today, start) && isFuture(start)) {
    return { text: 'Coming soon', color: 'marble' };
  } else if (!isSameDay(today, end) && isPast(end)) {
    return { text: 'Past', color: 'marble' };
  } else if (closesToday || closesInSevenDays) {
    return { text: 'Final week', color: 'orange' };
  } else {
    return { text: 'Now on', color: 'validation.green' };
  }
}

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
