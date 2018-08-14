// @flow
import NextLink from 'next/link';
import {font} from '../../../../utils/classnames';
import {trackIfOutboundLink, trackEvent} from '../../../../utils/ga';
import type {GaEvent} from '../../../../utils/ga';

type Props = {|
  url: string,
  text: string,
  extraClasses?: string,
  trackingEvent?: GaEvent
|}

const SecondaryLink = ({
  url,
  text,
  extraClasses,
  trackingEvent
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
        className={`secondary-link ${font({s: 'HNM5', m: 'HNM4'})} ${extraClasses || ''}`}>
        {text}
      </a>
    </NextLink>
  );
};

export default SecondaryLink;
