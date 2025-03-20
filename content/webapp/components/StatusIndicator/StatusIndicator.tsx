import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import {
  addDays,
  isFuture,
  isPast,
  isSameDay,
  isSameDayOrBefore,
  today,
} from '@weco/common/utils/dates';
import { PaletteColor } from '@weco/common/views/themes/config';
import TextWithDot from '@weco/content/components/TextWithDot';

type Props = {
  start: Date;
  end: Date;
  statusOverride?: string;
  isLarge?: boolean;
};

export function formatDateRangeWithMessage({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): { text: string; color: PaletteColor } {
  const closesInThisWeek = isSameDayOrBefore(end, addDays(today(), 6));

  const opensToday = isSameDay(start, today());
  const closesToday = isSameDay(end, today());

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
  isLarge = false,
}: Props) => {
  const { color, text } = statusOverride
    ? { color: 'neutral.500' as PaletteColor, text: statusOverride }
    : formatDateRangeWithMessage({ start, end });

  return (
    <TextWithDot
      className={isLarge ? font('intr', 4) : font('intr', 5)}
      dotColor={color}
      text={text}
    />
  );
};

export default StatusIndicator;
