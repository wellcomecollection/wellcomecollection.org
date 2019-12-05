// @flow

import { forwardRef } from 'react';
import Icon from '../../Icon/Icon';
import type { GaEvent } from '../../../../utils/ga';
import { trackEvent } from '../../../../utils/ga';
import NextLink from 'next/link';
import { type NextLinkType } from '../../../../model/next-link-type';

type Props = {|
  tabIndex?: string,
  link?: NextLinkType,
  scroll?: boolean,
  replace?: boolean,
  prefetch?: boolean,
  id?: string,
  type: 'light' | 'dark' | 'on-black' | 'black-on-white',
  extraClasses?: string,
  icon: string,
  text: string,
  trackingEvent?: GaEvent,
  disabled?: boolean,
  ariaControls?: string,
  ariaExpanded?: boolean,
  clickHandler?: (event: Event) => void | Promise<void>,
|};

type InnerControlProps = { text: string, icon: string };
const InnerControl = ({ text, icon }: InnerControlProps) => (
  <span className="control__inner flex-inline flex--v-center flex--h-center">
    <Icon name={icon} />
    <span className="visually-hidden">{text}</span>
  </span>
);

const Control = forwardRef<Props, HTMLButtonElement | HTMLAnchorElement>(
  (
    {
      tabIndex,
      link,
      scroll,
      replace,
      prefetch,
      id,
      type,
      extraClasses,
      icon,
      text,
      disabled,
      clickHandler,
      trackingEvent,
      ariaControls,
      ariaExpanded,
    }: Props,
    ref
  ) => {
    const attrs = {
      'aria-controls': ariaControls || undefined,
      'aria-expanded': ariaExpanded || undefined,
      tabIndex: tabIndex || undefined,
      id: id,
      className: `control control--${type} ${extraClasses || ''}`,
      disabled: disabled,
      onClick: handleClick,
    };

    function handleClick(event) {
      if (trackingEvent) {
        trackEvent(trackingEvent);
      }

      if (clickHandler) {
        clickHandler(event);
      }
    }

    return (
      <>
        {link ? (
          <NextLink
            {...link}
            scroll={scroll}
            replace={replace}
            prefetch={prefetch}
          >
            <a ref={ref} {...attrs}>
              <InnerControl text={text} icon={icon} />
            </a>
          </NextLink>
        ) : (
          <button ref={ref} {...attrs}>
            <InnerControl text={text} icon={icon} />
          </button>
        )}
      </>
    );
  }
);

Control.displayName = 'Control';

export default Control;
