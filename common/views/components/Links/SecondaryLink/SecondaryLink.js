// @flow
import type {NextLinkType} from '@weco/common/model/next-link-type';
import NextLink from 'next/link';
import {font, conditionalClassNames} from '../../../../utils/classnames';
import {trackIfOutboundLink, trackEvent} from '../../../../utils/ga';
import Icon from '../../Icon/Icon';
import type {GaEvent} from '../../../../utils/ga';

type Props = {|
  link: NextLinkType,
  text: string,
  extraClasses?: string,
  trackingEvent?: GaEvent,
  icon?: string
|}

const SecondaryLink = ({
  link,
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
    <NextLink href={link.href} as={link.as}>
      <a
        onClick={handleClick}
        className={conditionalClassNames({
          'flex-inline': true,
          'flex-v-center': true,
          [font({s: 'HNM5', m: 'HNM4'})]: true,
          [extraClasses || '']: Boolean(extraClasses)
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
