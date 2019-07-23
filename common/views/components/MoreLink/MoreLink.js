// @flow
import { font, conditionalClassNames } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import { trackEvent } from '../../../utils/ga';
import type { GaEvent } from '../../../utils/ga';

type Props = {|
  url: string,
  name: string,
  screenReaderText?: string,
  isJumpLink?: boolean,
  trackingEvent?: GaEvent,
|};

const MoreLink = ({
  url,
  name,
  screenReaderText,
  isJumpLink = false,
  trackingEvent,
}: Props) => {
  function handleClick(event) {
    if (trackingEvent) {
      trackEvent({
        category: 'MoreLink',
        action: 'follow link',
        label: `${url} | text: ${name}`,
      });
    }
  }

  return (
    <a
      onClick={handleClick}
      className={conditionalClassNames({
        'more-link': true,
        'flex-inline': true,
        'flex-v-center': true,
        [font('hnm', 5)]: true,
        'js-scroll-to-info': url.startsWith('#'),
      })}
      href={url}
    >
      {isJumpLink && (
        <Icon name="arrowSmall" extraClasses="icon--green icon--90" />
      )}
      {name}
      {screenReaderText && (
        <span className="visually-hidden"> {screenReaderText}</span>
      )}
      {!isJumpLink && <Icon name="arrowSmall" extraClasses="icon--green" />}
    </a>
  );
};

export default MoreLink;
