import styled from 'styled-components';
import { classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const FrameGridWrap = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'xl', properties: ['margin-bottom'] },
})`
  position: relative;

  ${props =>
    props.theme.media('medium')(`
    padding: 0;
  `)}
`;

type FrameGridProps = { $isThreeUp: boolean };
export const FrameGrid = styled.div<FrameGridProps>`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;

  ${props =>
    props.theme.media('medium')(`
    grid-template-columns: 1fr 1fr;
  `)}

  ${props =>
    props.theme.media('large')(`
    ${props.$isThreeUp && `grid-template-columns: 1fr 1fr 1fr;`}
  `)}
`;

export const FrameItem = styled.div`
  width: 100%;
  background: ${props => props.theme.color('white')};
`;

export const GalleryTitle = styled(Space).attrs({
  as: 'span',
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;

  h2 {
    margin-bottom: 0;
  }
`;

type GalleryProps = {
  $isActive: boolean;
  $isStandalone: boolean;
  $pageBackground: 'warmNeutral.300' | 'white';
};
export const Gallery = styled.div<GalleryProps>`
  position: relative;

  .caption {
    display: none;
  }

  .tasl {
    display: none;
  }

  img {
    transition: filter 400ms ease;
  }

  ${props =>
    !props.$isActive &&
    `
      img:hover {
        filter: brightness(80%);
      }
    `}

  ${props =>
    props.$isActive &&
    `
    .caption {
      display: block;
    }

    .tasl {
      display: inherit;
    }

    color: ${props.theme.color('white')};
    background: linear-gradient(
      ${props.theme.color(props.$pageBackground)} 100px,
      ${props.theme.color('neutral.700')} 100px
    );

    ${props.theme.media('medium')(`
      background: linear-gradient(
        ${props.theme.color(props.$pageBackground)} 200px,
        ${props.theme.color('neutral.700')} 200px
      );

      ${
        props.$isStandalone &&
        `background: ${props.theme.color('neutral.700')};`
      }
    `)}
  `}

  transition: all 400ms ease;

  ${props =>
    props.$isStandalone &&
    `
    background: ${props.theme.color('neutral.700')};

    &::before {
      top: 0;

      ${props.theme.media('medium')`
        top: 0;
      `}
    }
  `}

  .close {
    position: sticky;
    top: 18px;
    transform: translateX(calc((100vw - 100%) / 2));
    z-index: 3;
    pointer-events: all;
  }

  .background {
    top: 100px;
    opacity: 0;
    transition: opacity 400ms ease;

    ${props => props.$isActive && `opacity: 0.1;`}

    ${props => props.$isStandalone && `top: 0;`}

    ${props =>
      props.theme.media('medium')(`
        top: 200px;
    `)}
  }
`;

export const CloseWrapper = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top'] },
})`
  position: absolute;
  display: none;

  .enhanced & {
    display: inherit;
    top: 100px;
    bottom: 0;
    width: 100%;
    pointer-events: none;

    ${props => props.theme.media('medium')`
        top: 200px;
      `}
  }
`;

export const StandaloneWobblyEdge = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
`;

export const WobblyEdgeWrapper = styled.div`
  position: absolute;
  bottom: -2px;
  width: 100%;
`;

type ButtonContainerProps = { $isHidden: boolean };
export const ButtonContainer = styled.div<ButtonContainerProps>`
  display: ${props => (props.$isHidden ? 'none' : 'block')};
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  z-index: 2;
`;

type ControlContainerProps = { $isActive: boolean };
export const ControlContainer = styled(Space).attrs<ControlContainerProps>(
  props => ({
    className: classNames({
      close: true,
      'is-hidden': !props.$isActive,
    }),
    $v: { size: 'm', properties: ['padding-bottom'] },
    $h: { size: 'm', properties: ['padding-right'] },
  })
)<ControlContainerProps>`
  display: flex;
  justify-content: flex-end;
`;
