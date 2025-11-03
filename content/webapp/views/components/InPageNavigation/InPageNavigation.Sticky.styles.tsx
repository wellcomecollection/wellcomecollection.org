import NextLink from 'next/link';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import AnimatedUnderlineCSS, {
  AnimatedUnderlineProps,
} from '@weco/common/views/components/styled/AnimatedUnderline';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
const leftOffset = '12px';

export const InPageNavList = styled(PlainList)<{ $isOnWhite: boolean }>`
  padding-bottom: ${props => props.theme.spacingUnits['4']}px;
  border-bottom: 1px solid
    ${props => props.theme.color(props.$isOnWhite ? 'neutral.300' : 'white')};

  ${props => props.theme.media('large')`
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

  margin-left: -${props => props.theme.containerPadding.small}px;
  margin-right: -${props => props.theme.containerPadding.small}px;
  padding-left: calc(
    ${props => props.theme.containerPadding.small}px + ${leftOffset}
  );
  /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
  padding-right: ${props => props.theme.containerPadding.small}px;

  ${props =>
    props.theme.media('medium')(`
    margin-left: -${props.theme.containerPadding.medium}px;
    margin-right: -${props.theme.containerPadding.medium}px;
    padding-left: calc(${props.theme.containerPadding.medium}px + ${leftOffset});
    padding-right: ${props.theme.containerPadding.medium}px;
  `)}

  &::before {
    content: '';
    display: ${props => (props.$hasStuck ? 'none' : 'block')};
    position: absolute;
    left: calc(${props => props.theme.containerPadding.small}px + 1px);
    top: 0;
    bottom: 0;
    width: 1px;
    height: 100%;
    background: ${props =>
      props.theme.color(props.$isOnWhite ? 'neutral.300' : 'black')};
  }

  ${props =>
    props.theme.media('medium')(`
      &::before {
        left: calc(${props.theme.containerPadding.medium}px + 1px);
      }
    `)}

  ${props =>
    props.theme.media('large')(`
    border-top: 0;
    padding: 6px 0  6px ${leftOffset};
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

  ${props =>
    props.theme.media('large')(`
    --line-color: ${props.theme.color('white')};
    `)}

  & > span {
    font-size: 14px;
    line-height: 20px;
  }
`;

export const Anchor = styled.a.attrs({
  className: font('intb', 5),
})`
  color: ${props => props.theme.color('black')};
`;

export const InPageNavAnimatedLink = styled(AnimatedLink)<{
  $isActive?: boolean;
  $hasStuck: boolean;
  $isOnWhite: boolean;
}>`
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
    props.theme.media('large')(`
    color: ${props.theme.color('white')};

    &::before {
      background: ${props.theme.color('white')};
    `)}
`;

export const Root = styled(Space).attrs<{
  $hasStuck: boolean;
}>({
  as: 'nav',
  $v: { size: 'l', properties: ['padding-top'] },
})<{
  $hasStuck: boolean;
}>`
  position: sticky;
  top: 0;
  z-index: 20;
  color: ${props => props.theme.color('white')};

  ${props =>
    props.$hasStuck &&
    `
    border-bottom: 1px solid ${props.theme.color('neutral.300')};
  `}

  ${props =>
    props.theme.media('large')(`
    border-bottom: 0;
  `)}

  ${props =>
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
      margin-left: -${props.theme.containerPadding.small}px;
      margin-right: -${props.theme.containerPadding.small}px;
      padding-left: ${props.theme.containerPadding.small}px;
      padding-right: ${props.theme.containerPadding.small}px;

    `)}

  ${props =>
    props.theme.mediaBetween(
      'medium',
      'large'
    )(`
      margin-left: -${props.theme.containerPadding.medium}px;
      margin-right: -${props.theme.containerPadding.medium}px;
      padding-left: ${props.theme.containerPadding.medium}px;
      padding-right: ${props.theme.containerPadding.medium}px;
    `)}

  ${props =>
    props.theme.mediaBetween(
      'small',
      'large'
    )(`
      transition: background ${props.theme.transitionProperties};
      background: ${props.$hasStuck && props.theme.color('white')};
      padding-top: 0;
    `)}

  ${props =>
    props.theme.media('large')(`
      mix-blend-mode: difference;
      color: ${props.theme.color('white')};
    `)}
`;

export const MobileNavButton = styled.button.attrs({
  className: font('intm', 5),
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

  ${props => props.theme.media('large')`
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
