import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import { PaletteColor } from '@weco/common/views/themes/config';
import TextWithDot from '@weco/content/views/components/TextWithDot';

type EventStatusProps = {
  text: string;
  color: PaletteColor;
};

const EventStatus: FunctionComponent<EventStatusProps> = ({ text, color }) => {
  return (
    <div style={{ display: 'flex' }}>
      <TextWithDot
        className={font('sans-bold', -1)}
        dotColor={color}
        text={text}
      />
    </div>
  );
};

export default EventStatus;
