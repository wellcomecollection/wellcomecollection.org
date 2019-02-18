// @flow

import { forwardRef } from 'react';
import Icon from '../../Icon/Icon';
import type { GaEvent } from '../../../../utils/ga';
import { trackEvent } from '../../../../utils/ga';

type Props = {|
  tabIndex?: string,
  url?: string,
  id?: string,
  type: 'light' | 'dark',
  extraClasses?: string,
  icon: string,
  text: string,
  trackingEvent?: GaEvent,
  disabled?: boolean,
  ariaControls?: string,
  ariaExpanded?: boolean,
  clickHandler?: (event: Event) => void,
|};

type InnerControlProps = { text: string, icon: string };
const InnerControl = ({ text, icon }: InnerControlProps) => (
  <span className="control__inner flex-inline flex--v-center flex--h-center">
    <Icon name={icon} />
    <span className="visually-hidden">{text}</span>
  </span>
);

// $FlowFixMe (forwardRef)
const Control = forwardRef(
  (
    {
      tabIndex,
      url,
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
      href: url,
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

    return url ? (
      <a ref={ref} {...attrs}>
        <InnerControl text={text} icon={icon} />
      </a>
    ) : (
      <button ref={ref} {...attrs}>
        <InnerControl text={text} icon={icon} />
      </button>
    );
  }
);

Control.displayName = 'Control';

export default Control;
