import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import Icon from '../Icon/Icon';

type Props = {
  id: string;
};

const EventDatesLink = ({ id }: Props) => {
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
        [font('hnm', 5)]: true,
      })}
    >
      <Icon name={`arrowSmall`} extraClasses="icon--black icon--90" />
      <span>{`See all dates`}</span>
    </a>
  );
};

export default EventDatesLink;
