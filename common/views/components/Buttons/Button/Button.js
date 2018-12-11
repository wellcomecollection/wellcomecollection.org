// @flow

import type {GaEvent, GaEventV2} from '../../../../utils/ga';
import {trackEvent, trackEventV2} from '../../../../utils/ga';
import {font} from '../../../../utils/classnames';
import Icon from '../../Icon/Icon';

type Props = {|
  url?: string,
  type: 'primary' | 'secondary' | 'tertiary',
  extraClasses?: string,
  icon?: string,
  text: string,
  trackingEvent?: GaEvent,
  trackingEventV2?: GaEventV2,
  id?: string,
  disabled?: boolean,
  target?: string,
  download?: string,
  rel?: string,
  clickHandler?: (event: Event) => void
|}

const Button = ({
  url,
  type,
  id,
  extraClasses,
  icon,
  text,
  trackingEvent,
  trackingEventV2,
  disabled,
  target,
  download,
  rel,
  clickHandler
}: Props) => {
  const HtmlTag = url ? 'a' : 'button';
  const fontClasses = extraClasses && extraClasses.indexOf('btn--tertiary') > -1
    ? {s: 'HNM5'}
    : {s: 'HNM4'};
  function handleClick(e) {
    if (clickHandler) {
      clickHandler(e);
    }
    if (trackingEvent) {
      trackEvent(trackEvent);
    }
    if (trackingEventV2) {
      trackEventV2(trackEvent);
    }
  }
  return (
    <HtmlTag
      href={url}
      target={target}
      download={download}
      rel={rel}
      id={id}
      className={`btn btn--${type} ${extraClasses || ''} ${font(fontClasses)} flex-inline flex--v-center`}
      onClick={handleClick}
      disabled={disabled}>
      <span className='flex-inline flex--v-center'>
        {icon && <Icon name={icon} />}
        <span className='btn__text'>{text}</span>
      </span>
    </HtmlTag>
  );
};

export default Button;
