import {
  Children,
  cloneElement,
  FunctionComponent,
  isValidElement,
  ReactElement,
} from 'react';
import styled, { css, useTheme } from 'styled-components';

import { IconSvg } from '@weco/common/icons';
import { PinnableColor } from '@weco/common/views/themes/config';

import { brandIcons, BrandIconSvg } from './Icon.brandIcons';

type WrapperProps = {
  $rotate?: number;
  $iconColor?: PinnableColor;
  $matchText?: boolean;
  $sizeOverride?: string;
  $size?: number;
};

const Wrapper = styled.span.attrs({
  className: 'icon',
})<WrapperProps>`
  display: inline-block;
  height: ${props => props.$size ?? props.theme.iconDimension}px;
  width: ${props => props.$size ?? props.theme.iconDimension}px;
  position: relative;
  user-select: none;

  ${props =>
    props.$iconColor && `color: ${props.theme.color(props.$iconColor)};`}
  ${props => (props.$rotate ? `transform: rotate(${props.$rotate}deg);` : '')}

  ${props =>
    props.$matchText &&
    css`
      height: 1em;
      width: 1em;
    `}

  ${props => props.$sizeOverride}


  .icon__svg {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .icon__shape {
    transition: all ${props => props.theme.transitionProperties};
  }
`;

type Props = {
  icon: IconSvg;
  rotate?: number;
  iconColor?: PinnableColor;
  matchText?: boolean;
  sizeOverride?: string;
  title?: string;
  attrs?: { [key: string]: [string] };
};

// The package icons don't take a className, so add ours to their shapes to
// keep existing `.icon__shape` styles working. They render at the size
// they're drawn, which we read from the viewBox (16 or 24)
const renderBrandIcon = (BrandSvg: BrandIconSvg) => {
  const svg: ReactElement<{ children?: React.ReactNode; viewBox?: string }> =
    BrandSvg({});
  const size = Number(svg.props.viewBox?.split(' ')[2]) || undefined;

  return {
    size,
    element: cloneElement(svg, {
      children: Children.map(svg.props.children, child =>
        isValidElement<{ className?: string }>(child)
          ? cloneElement(child, { className: 'icon__shape' })
          : child
      ),
    }),
  };
};

const Icon: FunctionComponent<Props> = ({
  icon,
  rotate,
  iconColor,
  matchText,
  sizeOverride,
  title,
  attrs = {},
}: Props) => {
  const theme = useTheme();
  const brandIconSvg = theme.brandUpdate ? brandIcons.get(icon) : undefined;
  const brandIcon = brandIconSvg && renderBrandIcon(brandIconSvg);

  return (
    <Wrapper
      data-component="icon"
      aria-hidden={title ? true : undefined}
      $rotate={rotate}
      $iconColor={iconColor}
      $matchText={matchText}
      $sizeOverride={sizeOverride}
      $size={brandIcon?.size}
    >
      <svg
        className="icon__svg"
        {...(title
          ? { role: 'img', 'aria-labelledby': `icon-${title}-title` }
          : { 'aria-hidden': true })}
        {...attrs}
      >
        {title && <title id={`icon-${title}-title`}>{title}</title>}

        {/* This type guard is here just in case a string icon makes its way
       in via Prismic etc - that shouldn't happen but better safe than sorry.  */}
        {brandIcon
          ? brandIcon.element
          : typeof icon === 'function' &&
            (() => {
              const result = icon({});
              // Only render if result is not a Promise
              if (
                result &&
                typeof (result as unknown as PromiseLike<unknown>).then ===
                  'function'
              ) {
                // If it's a Promise, do not render anything
                return null;
              }
              // Only render if result is not a Promise (i.e., is a valid ReactNode)
              return result as React.ReactNode;
            })()}
      </svg>
    </Wrapper>
  );
};

export default Icon;
