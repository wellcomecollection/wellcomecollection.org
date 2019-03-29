// @flow
import { forwardRef } from 'react';
import NextLink from 'next/link';
import { type NextLinkType } from '../../../../model/next-link-type';
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
  link?: NextLinkType,
|};

// $FlowFixMe (forwardRef)
const Button = forwardRef(
  (
    {
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
      link,
      url, // url is deprecated, we should be using link
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

    return link ? (
      <NextLink {...link}>
        <a
          ref={ref}
          aria-controls={ariaControls}
          aria-expanded={ariaExpanded}
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
        </a>
      </NextLink>
    ) : (
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
