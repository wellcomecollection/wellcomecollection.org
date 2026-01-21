import NextLink from 'next/link';
import styled from 'styled-components';

import { font, fontFamily } from '@weco/common/utils/classnames';
import AnimatedUnderlineCSS, {
  AnimatedUnderlineProps,
} from '@weco/common/views/components/styled/AnimatedUnderline';
import { GridCell } from '@weco/common/views/components/styled/Grid';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

const leftOffset = '12px';

export const InPageNavList = styled(PlainList)<{ $isOnWhite: boolean }>`
  padding-bottom: ${props => props.theme.spacingUnits['150']};
  border-bottom: 1px solid
    ${props => props.theme.color(props.$isOnWhite ? 'neutral.300' : 'white')};

  ${props =>
    props.theme.mediaBetween(
      'zero',
      'md'
    )(`
      max-height: 90vh;
      overflow-x: hidden;
      overflow-y: auto;
    `)}

  ${props => props.theme.media('md')`
    padding-bottom: 0;
    border-bottom: 0;
  `}
`;
export const BackgroundOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.color('black')};
  opacity: 0.7;
`;

export const ListItem = styled.li<{ $hasStuck: boolean; $isOnWhite: boolean }>`
  position: relative;
  padding-bottom: 12px;
  padding-top: 12px;
  border-top: 1px solid
    ${props =>
      props.theme.color(props.$hasStuck ? 'neutral.300' : 'transparent')};

  margin-left: -${props => props.theme.containerPadding};
  margin-right: -${props => props.theme.containerPadding};
  padding-left: calc(
    ${props => props.theme.containerPaddingVw} + ${leftOffset}
  );
  /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
  padding-right: ${props => props.theme.containerPaddingVw};

  ${props =>
    props.theme.media('sm')(`
    margin-left: -${props.theme.containerPaddingVw};
    margin-right: -${props.theme.containerPaddingVw};
    padding-left: calc(${props.theme.containerPaddingVw} + ${leftOffset});
    padding-right: ${props.theme.containerPaddingVw};
  `)}

  &::before {
    content: '';
    display: ${props => (props.$hasStuck ? 'none' : 'block')};
    position: absolute;
    left: calc(${props => props.theme.containerPadding} + 1px);
    top: 0;
    bottom: 0;
    width: 1px;
    height: 100%;
    background: ${props =>
      props.theme.color(props.$isOnWhite ? 'neutral.300' : 'black')};
  }

  ${props =>
    props.theme.media('sm')(`
      &::before {
        left: calc(${props.theme.containerPadding} + 1px);
      }
    `)}

  ${props =>
    props.theme.media('md')(`
    border-top: 0;
    padding: 7px 0 7px ${leftOffset};
    margin: 0;

    &::before {
      display: block;
      left: 1px;
      background: ${props.theme.color('black')};
    }
    `)}
`;

const AnimatedLink = styled(NextLink)<AnimatedUnderlineProps>`
  ${AnimatedUnderlineCSS}
  text-decoration: none;
  line-height: 1;

  ${props =>
    props.theme.media('md')(`
    --line-color: ${props.theme.color('white')};
    `)}

  & > span {
    font-size: 14px;
    line-height: 1.6;
  }
`;

export const Anchor = styled.a.attrs({
  className: font('sans-bold', -1),
})`
  color: ${props => props.theme.color('black')};
`;

type InPageNavAnimatedLinkProps = {
  $isActive?: boolean;
  $hasStuck: boolean;
  $isOnWhite: boolean;
};

export const InPageNavAnimatedLink = styled(
  AnimatedLink
).attrs<InPageNavAnimatedLinkProps>(props => ({
  className: fontFamily(props.$isActive ? 'sans-bold' : 'sans'),
}))<InPageNavAnimatedLinkProps>`
  color: ${props =>
    props.theme.color(
      props.$hasStuck ? 'black' : props.$isOnWhite ? 'black' : 'white'
    )};
  position: relative;
  display: block;

  &::before {
    content: '';
    position: absolute;
    left: -${leftOffset};
    top: 0;
    height: 100%;
    width: 3px;
    background: ${props =>
      props.theme.color(
        props.$hasStuck ? 'accent.green' : props.$isOnWhite ? 'black' : 'white'
      )};
    opacity: ${props => (props.$isActive ? 1 : 0)};
    transform: scaleY(${props => (props.$isActive ? 1 : 0.5)});
    transition:
      opacity ${props => props.theme.transitionProperties},
      transform ${props => props.theme.transitionProperties};
  }

  ${props =>
    props.theme.media('md')(`
    color: ${props.theme.color('white')};

    &::before {
      background: ${props.theme.color('white')};
    `)}
`;

export const Root = styled(Space).attrs<{
  $hasStuck: boolean;
}>({
  as: 'nav',
  $v: { size: 'md', properties: ['padding-top'] },
})<{
  $hasStuck: boolean;
}>`
  position: relative;
  top: 0;
  z-index: 20;

  ${props => props.theme.media('md')`
    position: sticky;
  `}
  color: ${props => props.theme.color('white')};

  ${props =>
    props.$hasStuck &&
    `
    border-bottom: 1px solid ${props.theme.color('neutral.300')};
  `}

  ${props =>
    props.theme.mediaBetween(
      'zero',
      'md'
    )(`
      margin-left: -${props.theme.containerPaddingVw};
      margin-right: -${props.theme.containerPaddingVw};
      padding-left: ${props.theme.containerPaddingVw};
      padding-right: ${props.theme.containerPaddingVw};
      transition: background ${props.theme.transitionProperties};
      background: ${props.$hasStuck && props.theme.color('white')};
      padding-top: 0;

      ${
        props.$hasStuck &&
        `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        margin: 0;
      `
      }
    `)}

  ${props =>
    props.theme.media('md')(`
      border-bottom: 0;
      mix-blend-mode: difference;
      color: ${props.theme.color('white')};
    `)}
`;

export const MobileNavButton = styled.button.attrs({
  className: font('sans-bold', -1),
})<{ $hasStuck: boolean; $isListActive: boolean; $isOnWhite: boolean }>`
  --mobile-nav-border-color: ${props =>
    props.$hasStuck
      ? undefined
      : props.theme.color(props.$isOnWhite ? 'neutral.300' : 'white')};
  border-top: 1px solid var(--mobile-nav-border-color);
  border-bottom: ${props =>
    !props.$isListActive && '1px solid var(--mobile-nav-border-color)'};
  padding: 12px 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: ${props =>
    props.theme.color(
      props.$hasStuck ? 'black' : props.$isOnWhite ? 'black' : 'white'
    )};

  .icon {
    transition: transform ${props => props.theme.transitionProperties};
  }

  nav:has(ul.is-hidden-s) & {
    .icon {
      transform: rotate(45deg);
    }
  }

  ${props => props.theme.media('md')`
    display: none;
  `}
`;

export const AnimatedTextContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 20px;
  line-height: 20px;
  width: 100%;
`;

export const NavGridCell = styled(GridCell)<{
  $isEnhanced: boolean;
  $isOnWhite: boolean;
}>`
  --nav-grid-cell-background-color: ${props =>
    props.theme.color(props.$isOnWhite ? 'white' : 'neutral.700')};
  position: ${props => (props.$isEnhanced ? 'sticky' : 'relative')};
  top: 0;
  transition: background-color ${props => props.theme.transitionProperties};
  background-color: var(--nav-grid-cell-background-color);
  z-index: 3;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: ${props => props.theme.containerPaddingVw};
    bottom: 0;
    top: 0;
    transition: background-color ${props => props.theme.transitionProperties};
    background-color: var(--nav-grid-cell-background-color);
  }

  &::before {
    right: 100%;
  }

  &::after {
    left: 100%;
  }

  ${props =>
    props.theme.media('md')(`
    position: unset;
    background-color: unset;
    transition: unset;
    mix-blend-mode: difference;

    &::before,
    &::after {
      transition: unset;
      display: none;
    }
  `)}
`;
