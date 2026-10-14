import NextLink from 'next/link';
import { forwardRef, ForwardRefRenderFunction, JSX } from 'react';
import styled, { css } from 'styled-components';

import { IconSvg } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
import Icon from '@weco/common/views/components/Icon';
import { designSystemColor } from '@weco/common/views/themes/config';

const ControlInner = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
type ColorSchemeType = {
  $colorScheme?: 'light' | 'dark' | 'on-black' | 'black-on-white';
  $isOnDark?: boolean;
};

// The brand's round controls: dark on light backgrounds and light on dark
// ones, inverting on hover with a thin ring
const brandControlStyles = (isOnDark: boolean) => {
  const fill = designSystemColor(isOnDark ? 'neutral.10' : 'neutral.70');
  const ink = designSystemColor(isOnDark ? 'neutral.70' : 'neutral.10');

  // Swap instantly: fading inverted colours passes through a point where the
  // icon and fill match, so the icon flickers out
  return `
    box-sizing: border-box;
    background: ${fill};
    border: 1px solid transparent;
    transition: none;

    .icon,
    .icon__shape {
      transition: none;
    }

    .icon__shape {
      fill: ${ink};
    }

    &:hover {
      background: ${ink};
      border-color: ${fill};

      .icon__shape {
        fill: ${fill};
      }
    }

    &[disabled] {
      /* Pointer events back on, so the cursor shows; disabled stops clicks */
      pointer-events: auto;
      cursor: not-allowed;
      background: ${designSystemColor('ui.grey.40')};
      border-color: ${designSystemColor('ui.grey.60')};

      .icon__shape {
        fill: ${designSystemColor('ui.grey.60')};
      }
    }
  `;
};
const ButtonStyles = css<ColorSchemeType>`
  display: inline-block;
  border-radius: 50%;
  padding: 0;
  transition: background ${props => props.theme.transitionProperties};
  width: 46px;
  height: 46px;

  &[disabled] {
    pointer-events: none;
    transition: all ${props => props.theme.transitionProperties};
  }

  ${props =>
    props.$colorScheme === 'light' &&
    `
    background: ${props.theme.color('white')};
    border: 2px solid ${props.theme.color('accent.green')};

    .icon__shape {
      fill: ${props.theme.color('accent.green')};
    }

    &:hover {
      background: ${props.theme.color('accent.green')};

      .icon__shape {
        fill: ${props.theme.color('white')};
      }
    }

    &[disabled] {
      background: transparent;
      border-color: ${props.theme.color('neutral.500')};

      .icon__shape {
        fill: ${props.theme.color('neutral.500')};
      }
    }
  `}

  ${props =>
    props.$colorScheme === 'dark' &&
    `
    border: 0;
    background: ${props.theme.color('accent.green')};

    .icon__shape {
      fill: ${props.theme.color('white')};
    }

    &:hover {
      background: ${props.theme.color('black')};
    }

    &[disabled] {
      background: ${props.theme.color('neutral.500')};
    }
  `}

  ${props =>
    props.$colorScheme === 'on-black' &&
    `
    border: 0;
    border-radius: 0;
    background: #1f1f1f;

    .icon__shape {
      fill: ${props.theme.color('white')};
    }

    &:hover {
      .icon__shape {
        fill: ${props.theme.color('yellow')};
      }
    }


    &[disabled] {
      .icon__shape {
        fill: ${props.theme.color('neutral.400')};
      }
    }
  `}

  ${props =>
    props.$colorScheme === 'black-on-white' &&
    `
    background: ${props.theme.color({ brand: 'neutral.10', legacy: 'white' })};
    border: none;

    .icon__shape {
      fill: ${props.theme.color('neutral.700')};
    }

    &:hover {
      background: ${props.theme.color('yellow')};

      .icon__shape {
        fill: ${props.theme.color('neutral.700')};
      }
    }

    &[disabled] {
      .icon__shape {
        fill: ${props.theme.color('neutral.600')};
      }
    }
  `}

  ${props =>
    props.theme.brandUpdate &&
    (props.$colorScheme === 'light' ||
      props.$colorScheme === 'black-on-white') &&
    brandControlStyles(
      !!props.$isOnDark || props.$colorScheme === 'black-on-white'
    )}
`;

const Wrapper = styled.button.attrs<{ $extraClasses?: string }>(props => ({
  className: props.$extraClasses || undefined,
}))<ColorSchemeType>`
  ${ButtonStyles}
`;

const NextLinkWrapper = styled(NextLink).attrs<{ $extraClasses?: string }>(
  props => ({
    className: props.$extraClasses || undefined,
  })
)<ColorSchemeType>`
  ${ButtonStyles}
`;

type CommonProps = {
  link?: LinkProps;
  scroll?: boolean;
  replace?: boolean;
  prefetch?: boolean;
  colorScheme?: 'light' | 'dark' | 'on-black' | 'black-on-white';
  // The brand needs to know, as light-scheme controls go dark on light pages
  isOnDark?: boolean;
  extraClasses?: string;
  icon: IconSvg;
  text: string;
  disabled?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  dataGtmTrigger?: string;
  dataTestId?: string;
  ariaPressed?: 'true' | 'false' | 'mixed';
  clickHandler?: (event: Event) => void | Promise<void>;
};

export type ButtonProps = CommonProps & { link?: undefined } & Omit<
    JSX.IntrinsicElements['button'],
    'ref'
  >;

interface AnchorProps
  extends Omit<JSX.IntrinsicElements['a'], 'ref'>, CommonProps {
  link: LinkProps;
}

type InnerControlProps = { text: string; icon: IconSvg };
const InnerControl = ({ text, icon }: InnerControlProps) => (
  <ControlInner>
    <Icon icon={icon} />
    <span className="visually-hidden">{text}</span>
  </ControlInner>
);

type Props = ButtonProps | AnchorProps;

const BaseControl: ForwardRefRenderFunction<HTMLButtonElement, Props> = (
  {
    tabIndex,
    link,
    scroll,
    replace,
    prefetch,
    id,
    colorScheme,
    isOnDark,
    extraClasses,
    icon,
    text,
    disabled,
    clickHandler,
    ariaControls,
    ariaExpanded,
    ariaPressed,
    dataGtmTrigger,
    dataTestId,
  }: Props,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: any
) => {
  const attrs = {
    id,
    disabled,
    'aria-controls': ariaControls,
    'aria-expanded': ariaExpanded,
    'aria-pressed': ariaPressed,
    'data-gtm-trigger': dataGtmTrigger,
    'data-testid': dataTestId,
    tabIndex,
    $extraClasses: extraClasses,
    $colorScheme: colorScheme,
    $isOnDark: isOnDark,
    onClick: handleClick,
  };

  function handleClick(event) {
    if (clickHandler) {
      clickHandler(event);
    }
  }

  return (
    <>
      {/* If a link is provided, render as an anchor tag, otherwise render as a button */}
      {link ? (
        <NextLinkWrapper
          {...link}
          data-component="control"
          scroll={scroll}
          replace={replace}
          prefetch={prefetch}
          ref={ref}
          {...attrs}
        >
          <InnerControl text={text} icon={icon} />
        </NextLinkWrapper>
      ) : (
        <Wrapper data-component="control" ref={ref} {...attrs}>
          <InnerControl text={text} icon={icon} />
        </Wrapper>
      )}
    </>
  );
};

const Control = forwardRef<HTMLButtonElement, Props>(BaseControl);

export default Control;
