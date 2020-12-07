import { forwardRef } from 'react';
import NextLink from 'next/link';
import { LinkProps } from '../../../../model/link-props';
import Icon from '../../Icon/Icon';
import { GaEvent, trackEvent } from '../../../../utils/ga';

type CommonProps = {
  link?: LinkProps;
  scroll?: boolean;
  replace?: boolean;
  prefetch?: boolean;
  colorScheme?: 'light' | 'dark' | 'on-black' | 'black-on-white';
  extraClasses?: string;
  icon: string;
  text: string;
  trackingEvent?: GaEvent;
  disabled?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  clickHandler?: (event: Event) => void | Promise<void>;
};

interface ButtonProps
  extends Omit<JSX.IntrinsicElements['button'], 'ref'>,
    CommonProps {
  link?: undefined;
}
interface AnchorProps
  extends Omit<JSX.IntrinsicElements['a'], 'ref'>,
    CommonProps {
  link: LinkProps;
}

type InnerControlProps = { text: string; icon: string };
const InnerControl = ({ text, icon }: InnerControlProps) => (
  <span className="control__inner flex-inline flex--v-center flex--h-center">
    <Icon name={icon} />
    <span className="visually-hidden">{text}</span>
  </span>
);

type Props = ButtonProps | AnchorProps;

const Control = forwardRef(
  (
    {
      tabIndex,
      link,
      scroll,
      replace,
      prefetch,
      id,
      colorScheme,
      extraClasses,
      icon,
      text,
      disabled,
      clickHandler,
      trackingEvent,
      ariaControls,
      ariaExpanded,
    }: Props,
    ref: any
  ) => {
    const attrs = {
      'aria-controls': ariaControls || undefined,
      'aria-expanded': ariaExpanded || undefined,
      tabIndex: tabIndex || undefined,
      id: id,
      className: `control control--${colorScheme} ${extraClasses || ''}`,
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
