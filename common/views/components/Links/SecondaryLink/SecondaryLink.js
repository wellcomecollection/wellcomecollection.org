// @flow
import NextLink from 'next/link';
import {font, conditionalClassNames} from '../../../../utils/classnames';
import {trackIfOutboundLink, trackEvent, trackEventV2} from '../../../../utils/ga';
import Icon from '../../Icon/Icon';
import type {GaEvent, GaEventV2} from '../../../../utils/ga';

type Props = {|
  url: string,
  text: string,
  extraClasses?: string,
  trackingEvent?: GaEvent,
  trackingEventV2?: GaEventV2,
  icon?: string
|}

const SecondaryLink = ({
  url,
  text,
  extraClasses,
  trackingEvent,
  trackingEventV2,
  icon
}: Props) => {
  function handleClick(event) {
    trackIfOutboundLink(event.currentTarget.href);
    if (trackingEvent) {
      trackEvent(trackingEvent);
    }

    if (trackingEventV2) {
      trackEventV2(trackingEventV2);
    }
  }

  return (
    <NextLink href={url}>
      <a
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
