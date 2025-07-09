import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';

const leftOffset = '12px';

export const BackgroundOverlay = styled.div<{ $isActive: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props =>
    props.$isActive ? props.theme.color('black') : 'transparent'};
  opacity: ${props => (props.$isActive ? 0.7 : 0)};
  transition: opacity ${props => props.theme.transitionProperties};
  z-index: ${props => (props.$isActive ? '10' : '-1')};
`;

export const ListItem = styled.li<{ $hasStuck: boolean }>`
  position: relative;
  padding-bottom: 12px;
  padding-top: 12px;
  border-top: 1px solid
    ${props => props.theme.color(props.$hasStuck ? 'white' : 'transparent')};

  margin-left: -${themeValues.containerPadding.small}px;
  margin-right: -${themeValues.containerPadding.small}px;
  padding-left: calc(${themeValues.containerPadding.small}px + ${leftOffset});
  /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
  padding-right: ${themeValues.containerPadding.small}px;

  ${props =>
    props.theme.media('medium')(`
    margin-left: -${themeValues.containerPadding.medium}px;
    margin-right: -${themeValues.containerPadding.medium}px;
    padding-left: calc(${themeValues.containerPadding.medium}px + ${leftOffset});
    padding-right: ${themeValues.containerPadding.medium}px;
  `)}

  &::before {
    content: '';
    display: ${props => (props.$hasStuck ? 'none' : 'block')};
    position: absolute;
    left: calc(${themeValues.containerPadding.small}px + 1px);
    top: 0;
    bottom: 0;
    width: 1px;
    height: 100%;
    background: ${props => props.theme.color('black')};
  }

  ${props =>
    props.theme.media('medium')(`
      &::before {
        left: calc(${themeValues.containerPadding.medium}px + 1px);
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
    }
    `)}
`;

// If used elsewhere, this could be extracted to a shared styled component
const AnimatedLink = styled.a<{ $hasStuck: boolean }>`
  --line: ${props => props.theme.color(props.$hasStuck ? 'black' : 'white')};
  text-decoration: none;
  position: relative;

  ${props =>
    props.theme.media('large')(`
    --line: ${props.theme.color('white')};
    `)}

  & > span {
    background-image: linear-gradient(0deg, var(--line) 0%, var(--line) 100%);
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: var(--background-size, 0%) 2px;
    transition: background-size ${props => props.theme.transitionProperties};
    font-size: 14px;
    line-height: 20px;
    transform: translateZ(0);
    padding-bottom: 2px;
  }

  &:hover {
    --background-size: 100%;
  }
`;

export const Anchor = styled.a.attrs({
  className: font('intb', 5),
})`
  color: ${props => props.theme.color('black')};
`;

export const InPageNavAnimatedLink = styled(AnimatedLink)<{
  $isActive?: boolean;
  $hasBackgroundBlend?: boolean;
  $hasStuck: boolean;
}>`
  color: ${props =>
    props.$hasBackgroundBlend
      ? props.theme.color(props.$hasStuck ? 'black' : 'white')
      : 'inherit'};
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
      props.theme.color(props.$hasStuck ? 'accent.green' : 'white')};
    opacity: ${props => (props.$isActive ? 1 : 0)};
    transform: scaleY(${props => (props.$isActive ? 1 : 0.5)});
    transition:
      opacity ${props => props.theme.transitionProperties},
      transform ${props => props.theme.transitionProperties};
  }

  ${props =>
    props.theme.media('large')(`
    color: ${props.$hasBackgroundBlend ? props.theme.color('white') : 'inherit'};

    &::before {
      background: ${props.theme.color('white')};
    `)}
`;

const stickyRootAttrs = `
  position: sticky;
  top: 0;
  z-index: 20;
`;

export const Root = styled(Space).attrs<{
  $isSticky?: boolean;
  $hasStuck: boolean;
}>(props => ({
  as: 'nav',
  $h: props.$isSticky
    ? undefined
    : { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: {
    size: 'l',
    properties: props.$isSticky
      ? ['padding-top']
      : ['padding-top', 'padding-bottom'],
  },
}))<{
  $isSticky?: boolean;
  $hasBackgroundBlend?: boolean;
  $hasStuck: boolean;
}>`
  background: ${props =>
    !props.$hasBackgroundBlend && props.theme.color('warmNeutral.300')};
  ${props => (props.$isSticky ? stickyRootAttrs : '')}
  ${props =>
    props.$hasStuck &&
    `
    border-bottom: 1px solid ${props.theme.color('white')};
  `}

  ${props =>
    props.theme.media('large')(`
    border-bottom: 0;
  `)}

  ${props =>
    props.$isSticky &&
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
      margin-left: -${themeValues.containerPadding.small}px;
      margin-right: -${themeValues.containerPadding.small}px;
      padding-left: ${themeValues.containerPadding.small}px;
      padding-right: ${themeValues.containerPadding.small}px;

    `)}

  ${props =>
    props.$isSticky &&
    props.theme.mediaBetween(
      'medium',
      'large'
    )(`
      margin-left: -${themeValues.containerPadding.medium}px;
      margin-right: -${themeValues.containerPadding.medium}px;
      padding-left: ${props.theme.containerPadding.medium}px;
      padding-right: ${props.theme.containerPadding.medium}px;
    `)}

  ${props =>
    props.$isSticky &&
    props.theme.mediaBetween(
      'small',
      'large'
    )(`
      transition: background ${props.theme.transitionProperties};
      background: ${props.$hasStuck && props.theme.color('accent.lightGreen')};
      padding-top: 0;
    `)}

  ${props =>
    props.$isSticky &&
    props.theme.media('large')(`
      background: ${!props.$hasBackgroundBlend && props.theme.color('warmNeutral.300')};
      mix-blend-mode: ${props.$hasBackgroundBlend && 'difference'};
      color: ${props.$hasBackgroundBlend && props.theme.color('white')};
    `)}
`;

export const MobileNavButton = styled.button.attrs({
  className: font('intm', 5),
})<{ $hasStuck: boolean }>`
  border-top: ${props =>
    !props.$hasStuck && `1px solid ${props.theme.color('white')}`};
  border-bottom: ${props =>
    !props.$hasStuck && `1px solid ${props.theme.color('white')}`};
  padding: 12px 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: ${props => props.theme.color(props.$hasStuck ? 'black' : 'white')};

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
