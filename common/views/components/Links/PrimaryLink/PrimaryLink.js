// @flow
import {font, conditionalClassNames} from '../../../../utils/classnames';
import Icon from '../../Icon/Icon';
import {trackIfOutboundLink, trackEvent} from '../../../../utils/ga';
import type {GaEvent} from '../../../../utils/ga';

type Props = {|
  url: string,
  name: string,
  screenReaderText?: string,
  isJumpLink?: boolean,
  trackingEvent?: GaEvent
|}

const PrimaryLink = ({
  url,
  name,
  screenReaderText,
  isJumpLink = false,
  trackingEvent
}: Props) => {
  function handleClick(event) {
    trackIfOutboundLink(event.currentTarget.href);
    if (trackingEvent) {
      trackEvent(trackingEvent);
    }
  }

  return (
    <a
      onClick={handleClick}
      className={conditionalClassNames({
        'primary-link': true,
        'flex-inline': true,
        'flex-v-center': true,
        'plain-link': true,
        [font({s: 'HNM4'})]: true
      })}
      href={url}
      data-component='PrimaryLink'
      data-track-event={trackingEvent && JSON.stringify(trackingEvent)}
    >
      {isJumpLink &&
        <Icon name='arrowSmall' extraClasses='icon--green icon--90' />
      }
      {name}
      {screenReaderText && <span className='visually-hidden'> {screenReaderText}</span>}
      {!isJumpLink &&
        <Icon name='arrowSmall' extraClasses='icon--green' />
      }
    </a>
  );
};

export default PrimaryLink;
