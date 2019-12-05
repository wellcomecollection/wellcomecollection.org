// @flow
import { forwardRef } from 'react';
import NextLink from 'next/link';
import { type NextLinkType } from '../../../../model/next-link-type';
import type { GaEvent } from '../../../../utils/ga';
import { trackEvent } from '../../../../utils/ga';
import { font, classNames } from '../../../../utils/classnames';
import Icon from '../../Icon/Icon';
import Space from '../../styled/Space';

type Props = {|
  tabIndex?: string,
  url?: string,
  type: 'primary' | 'secondary' | 'tertiary',
  extraClasses?: string,
  className?: string,
  icon?: string,
  iconPosition?: 'start' | 'end',
  fontFamily?: 'hnl' | 'hnm',
  text: string,
  textHidden?: boolean,
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
      className,
      icon,
      iconPosition,
      fontFamily,
      text,
      textHidden = false,
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
          className={`btn btn--${type} ${extraClasses || className || ''} ${
            fontFamily ? font(fontFamily, fontSize) : font('hnm', fontSize)
          } flex-inline flex--v-center`}
          onClick={handleClick}
          disabled={disabled}
        >
          <span className="flex flex--v-center flex--h-center">
            {icon && (!iconPosition || iconPosition === 'start') && (
              <Space h={{ size: 'xs', properties: ['margin-right'] }}>
                <Icon name={icon} />
              </Space>
            )}
            <span
              className={classNames({
                'visually-hidden': textHidden,
                btn__text: true,
              })}
            >
              {text}
            </span>
            {icon && iconPosition === 'end' && (
              <Space h={{ size: 'xs', properties: ['margin-left'] }}>
                <Icon name={icon} />
              </Space>
            )}
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
        className={`btn btn--${type} ${extraClasses || className || ''} ${
          fontFamily ? font(fontFamily, fontSize) : font('hnm', fontSize)
        } flex-inline flex--v-center`}
        onClick={handleClick}
        disabled={disabled}
        type={url ? null : 'button'}
      >
        <span className="flex flex--v-center flex--h-center">
          {icon && (!iconPosition || iconPosition === 'start') && (
            <Space h={{ size: 'xs', properties: ['margin-right'] }}>
              <Icon name={icon} />
            </Space>
          )}
          <span
            className={classNames({
              'visually-hidden': textHidden,
              btn__text: true,
            })}
          >
            {text}
          </span>
          {icon && iconPosition === 'end' && (
            <Space h={{ size: 'xs', properties: ['margin-left'] }}>
              <Icon name={icon} />
            </Space>
          )}
        </span>
      </HtmlTag>
    );
  }
);

Button.displayName = 'Button';

export default Button;
