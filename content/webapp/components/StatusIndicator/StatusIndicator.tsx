import { font } from '@weco/common/utils/classnames';
import Dot from '@weco/common/views/components/Dot/Dot';
import { FunctionComponent } from 'react';
import {
  addDays,
  isFuture,
  isPast,
  isSameDay,
  isSameDayOrBefore,
  today,
} from '@weco/common/utils/dates';
import { PaletteColor } from '@weco/common/views/themes/config';
import DotWrapper from '@weco/common/views/components/Dot/DotWrapper';

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
  const closesInThisWeek = isSameDayOrBefore(end, addDays(today(), 6));

  const opensToday = isSameDay(start, today(), 'London');
  const closesToday = isSameDay(end, today(), 'London');

  if (!opensToday && isFuture(start)) {
    return { text: 'Coming soon', color: 'neutral.500' };
  } else if (!closesToday && isPast(end)) {
    return { text: 'Past', color: 'neutral.500' };
  } else if (closesInThisWeek) {
    return { text: 'Final week', color: 'accent.salmon' };
  } else {
    return { text: 'Now on', color: 'validation.green' };
  }
}

const StatusIndicator: FunctionComponent<Props> = ({
  start,
  end,
  statusOverride,
}: Props) => {
  const { color, text } = statusOverride
    ? { color: 'neutral.500' as PaletteColor, text: statusOverride }
    : formatDateRangeWithMessage({ start, end });

  return (
    <span className={`flex flex--v-center ${font('intr', 5)}`}>
      <DotWrapper>
        <Dot dotColor={color} />
      </DotWrapper>
      <span>{text}</span>
    </span>
  );
};

export default StatusIndicator;
