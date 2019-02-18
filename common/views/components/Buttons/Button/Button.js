// @flow

import { forwardRef } from 'react';
import type { GaEvent } from '../../../../utils/ga';
import { trackEvent } from '../../../../utils/ga';
import { font } from '../../../../utils/classnames';
import Icon from '../../Icon/Icon';

type Props = {|
  tabIndex?: string,
  url?: string,
  type: 'primary' | 'secondary' | 'tertiary',
  extraClasses?: string,
  icon?: string,
  text: string,
  trackingEvent?: GaEvent,
  id?: string,
  disabled?: boolean,
  target?: string,
  download?: string,
  rel?: string,
  ariaControls?: string,
  ariaExpanded?: boolean,
  clickHandler?: (event: Event) => void,
|};

// $FlowFixMe (forwardRef)
const Button = forwardRef(
  (
    {
      url,
      type,
      id,
      extraClasses,
      icon,
      text,
      trackingEvent,
      disabled,
      target,
      download,
      rel,
      clickHandler,
      ariaControls,
      ariaExpanded,
    }: Props,
    ref
  ) => {
    const HtmlTag = url ? 'a' : 'button';
    const fontClasses =
      extraClasses && extraClasses.indexOf('btn--tertiary') > -1
        ? { s: 'HNM5' }
        : { s: 'HNM4' };
    function handleClick(e) {
      if (clickHandler) {
        clickHandler(e);
      }
      if (trackingEvent) {
        trackEvent(trackingEvent);
      }
    }

    return (
      <HtmlTag
        ref={ref}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        href={url}
        target={target}
        download={download}
        rel={rel}
        id={id}
        className={`btn btn--${type} ${extraClasses || ''} ${font(
          fontClasses
        )} flex-inline flex--v-center`}
        onClick={handleClick}
        disabled={disabled}
      >
        <span className="flex-inline flex--v-center">
          {icon && <Icon name={icon} />}
          <span className="btn__text">{text}</span>
        </span>
      </HtmlTag>
    );
  }
);

Button.displayName = 'Button';

export default Button;
