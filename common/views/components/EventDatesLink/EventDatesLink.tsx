import { FunctionComponent } from 'react';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import Icon from '../Icon/Icon';

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
        [font('hnb', 5)]: true,
      })}
    >
      <Icon name={`arrowSmall`} color={'black'} rotate={90} />
      <span>{`See all dates`}</span>
    </a>
  );
};

export default EventDatesLink;
