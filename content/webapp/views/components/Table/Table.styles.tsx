import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';

export const ControlsWrap = styled.div`
  position: relative;
`;

export const ScrollButtonWrap = styled.div<{
  $isActive?: boolean;
  $isLeft?: boolean;
}>`
  position: absolute;
  z-index: 2;
  top: 50%;
  cursor: pointer;
  pointer-events: ${props => (props.$isActive ? 'all' : 'none')};
  opacity: ${props => (props.$isActive ? 1 : 0.2)};
  transition: opacity ${props => props.theme.transitionProperties};

  /* This hack is needed to override the spacing caused by being placed within a div with .spaced-text. */
  .spaced-text & {
    margin: 0;
  }

  ${props =>
    props.$isLeft &&
    `
    left: 0;
    transform: translateX(-50%) translateY(-50%) scale(0.6);
  `}

  ${props =>
    !props.$isLeft &&
    `
    right: 0;
    transform: translateX(50%) translateY(-50%) scale(0.6);
  `}

  ${props =>
    props.theme.media('medium')(`
    transform: ${
      props.$isLeft
        ? 'translateX(-50%) translateY(-50%)'
        : 'translateX(50%) translateY(-50%)'
    };
  `)}
`;

export const ScrollButtons = styled.div<{
  $isActive?: boolean;
}>`
  display: ${props => (props.$isActive ? 'block' : 'none')};
`;

export const TableWrap = styled.div`
  position: relative;
  max-width: 100%;
  overflow: scroll;
  background:
    linear-gradient(to right, white 30%, rgb(255, 255, 255, 0)),
    linear-gradient(to right, rgb(255, 255, 255, 0), white 70%) 0 100%,
    radial-gradient(
      farthest-side at 0% 50%,
      rgb(0, 0, 0, 0.2),
      rgb(0, 0, 0, 0)
    ),
    radial-gradient(
        farthest-side at 100% 50%,
        rgb(0, 0, 0, 0.2),
        rgb(0, 0, 0, 0)
      )
      0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size:
    40px 100%,
    40px 100%,
    14px 100%,
    14px 100%;
  background-position:
    0 0,
    100%,
    0 0,
    100%;
  background-attachment: local, local, scroll, scroll;
`;

export const TableTable = styled.table.attrs<{ $hasSmallerCopy?: boolean }>(
  props => ({
    className: font('sans', props.$hasSmallerCopy ? -2 : -1),
  })
)`
  width: 100%;
  border-collapse: collapse;
`;

export const TableThead = styled.thead`
  text-align: left;
`;

export const TableCaption = styled.caption.attrs({
  className: 'visually-hidden',
})``;

export const TableTbody = styled.tbody``;

export const TableTr = styled.tr<{ $withBorder?: boolean }>`
  ${TableTbody} & {
    border-bottom: ${props =>
      props.$withBorder
        ? `1px dotted ${props.theme.color('neutral.500')}`
        : 'none'};
  }

  ${TableTbody}.has-row-headers & {
    border-top: ${props =>
      props.$withBorder
        ? `1px dotted ${props.theme.color('neutral.500')}`
        : 'none'};
  }
`;

export const TableTh = styled.th<{ $plain?: boolean }>`
  ${props =>
    props.theme.makeSpacePropertyValues('xs', [
      'padding-bottom',
      'padding-top',
      'padding-left',
      'padding-right',
    ])}

  font-weight: bold;
  background: ${props =>
    props.$plain ? 'transparent' : props.theme.color('warmNeutral.400')};
  white-space: nowrap;

  ${TableTbody}.has-row-headers & {
    background: transparent;
    text-align: left;
  }
`;

export const TableTd = styled.td<{ $vAlign?: string }>`
  ${props =>
    props.theme.makeSpacePropertyValues('xs', [
      'padding-bottom',
      'padding-top',
      'padding-left',
      'padding-right',
    ])}

  vertical-align: ${props => props.$vAlign};
  white-space: nowrap;
  height: 53px;
`;
