import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Dot from '@weco/common/views/components/Dot/Dot';
import { FC } from 'react';
import {
  addDays,
  isFuture,
  isPast,
  isSameDay,
  today,
} from '@weco/common/utils/dates';
import { PaletteColor } from '@weco/common/views/themes/config';

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
}): { text: string; color: PaletteColor } {
  const sevenDaysTime = addDays(today(), 7);

  const opensToday = isSameDay(start, today(), 'London');
  const closesToday = isSameDay(end, today(), 'London');
  const closesInSevenDays = today() < end && end < sevenDaysTime;

  if (!opensToday && isFuture(start)) {
    return { text: 'Coming soon', color: 'neutral.500' };
  } else if (!closesToday && isPast(end)) {
    return { text: 'Past', color: 'neutral.500' };
  } else if (closesToday || closesInSevenDays) {
    return { text: 'Final week', color: 'accent.salmon' };
  } else {
    return { text: 'Now on', color: 'validation.green' };
  }
}

const StatusIndicator: FC<Props> = ({ start, end, statusOverride }: Props) => {
  const { color, text } = statusOverride
    ? { color: 'neutral.500' as PaletteColor, text: statusOverride }
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
