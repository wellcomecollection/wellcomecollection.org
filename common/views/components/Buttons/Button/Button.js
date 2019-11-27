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
  iconPosition?: 'start' | 'end',
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
      iconPosition,
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
    const fontSize = type === 'tertiary' ? 6 : 5;
    const HtmlTag = url ? 'a' : 'button';
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
            'hnm',
            fontSize
          )} flex-inline flex--v-center`}
          onClick={handleClick}
          disabled={disabled}
        >
          <span className="flex-inline flex--v-center">
            {icon && (!iconPosition || iconPosition === 'start') && (
              <Icon name={icon} />
            )}
            <span className="btn__text">{text}</span>
            {icon && iconPosition === 'end' && <Icon name={icon} />}
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
          'hnm',
          fontSize
        )} flex-inline flex--v-center`}
        onClick={handleClick}
        disabled={disabled}
        type={url ? null : 'button'}
      >
        <span className="flex-inline flex--v-center">
          {icon && (!iconPosition || iconPosition === 'start') && (
            <Icon name={icon} />
          )}
          <span className="btn__text">{text}</span>
          {icon && iconPosition === 'end' && <Icon name={icon} />}
        </span>
      </HtmlTag>
    );
  }
);

Button.displayName = 'Button';

export default Button;
