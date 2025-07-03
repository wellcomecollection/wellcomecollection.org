import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import TextWithDot from '@weco/common/views/components/TextWithDot';
import { PaletteColor } from '@weco/common/views/themes/config';

type EventStatusProps = {
  text: string;
  color: PaletteColor;
};

const EventStatus: FunctionComponent<EventStatusProps> = ({ text, color }) => {
  return (
    <div style={{ display: 'flex' }}>
      <TextWithDot className={font('intb', 5)} dotColor={color} text={text} />
    </div>
  );
};

export default EventStatus;
