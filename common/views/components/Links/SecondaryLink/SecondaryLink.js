// @flow
import NextLink from 'next/link';
import {font, conditionalClassNames} from '../../../../utils/classnames';
import {trackIfOutboundLink, trackEvent} from '../../../../utils/ga';
import Icon from '../../Icon/Icon';
import type {GaEvent} from '../../../../utils/ga';

type Props = {|
  url: string,
  text: string,
  extraClasses?: string,
  trackingEvent?: GaEvent,
  icon?: string
|}

const SecondaryLink = ({
  url,
  text,
  extraClasses,
  trackingEvent,
  icon
}: Props) => {
  function handleClick(event) {
    trackIfOutboundLink(event.currentTarget.href);
    if (trackingEvent) {
      trackEvent(trackingEvent);
    }
  }

  return (
    <NextLink href={url}>
      <a
        data-track-event={trackingEvent && JSON.stringify(trackingEvent)}
        onClick={handleClick}
        className={conditionalClassNames({
          'secondary-link': true,
          'flex-inline': true,
          'flex-v-center': true,
          [font({s: 'HNM5', m: 'HNM4'})]: true,
          [extraClasses || '']: Boolean(extraClasses),
          'js-scroll-to-info': url.startsWith('#')
        })}>
        {icon &&
          <Icon name={icon} extraClasses='icon--black icon--90' />
        }
        {text}
      </a>
    </NextLink>
  );
};

export default SecondaryLink;
