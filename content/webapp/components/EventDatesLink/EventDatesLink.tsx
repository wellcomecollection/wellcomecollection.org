import { FunctionComponent } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '@weco/common/views/components/Icon/Icon';
import { arrowSmall } from '@weco/common/icons';

type Props = {
  id: string;
};

const EventDatesLink: FunctionComponent<Props> = ({ id }: Props) => {
  return (
    <a
      href={`#dates`}
      onClick={() => {
        trackEvent({
          category: 'EventDatesLink',
          action: 'follow link',
          label: id,
        });
      }}
      className={classNames({
        'flex-inline': true,
        'flex-v-center': true,
        [font('intb', 5)]: true,
      })}
    >
      <Icon icon={arrowSmall} color={'black'} rotate={90} />
      <span>{`See all dates`}</span>
    </a>
  );
};

export default EventDatesLink;
