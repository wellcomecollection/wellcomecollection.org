import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const AudioPlayerWrapper = styled(Space).attrs({
  as: 'figure',
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
})<{ $isDark: boolean }>`
  background: ${props =>
    props.theme.color(props.$isDark ? 'black' : 'transparent')};
  margin: 0;
`;

type PlayPauseButtonProps = { $isPlaying: boolean };
export const PlayPauseButton = styled.button.attrs<PlayPauseButtonProps>(
  props => ({
    'aria-pressed': props.$isPlaying,
  })
)<PlayPauseButtonProps>`
  padding: ${props => props.theme.spacingUnits['200']}
    ${props => props.theme.spacingUnits['300']} 0;
`;

export const TimeWrapper = styled.div.attrs({
  className: font('sans', -2),
})<{ $isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.color(props.$isDark ? 'white' : 'black')};
`;

export const SkipPlayWrapper = styled.div`
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const colorTransform = css<{ $isDark: boolean }>`
  color: ${props => props.theme.color(props.$isDark ? 'yellow' : 'black')};
  transform: scale(1.1);
`;

export const SkipButton = styled.button<{ $isDark: boolean }>`
  padding: ${props => props.theme.spacingUnits['200']} 0 0;
  color: ${props => props.theme.color(props.$isDark ? 'white' : 'black')};

  transition:
    color 0.2s ease-out,
    transform 0.2s ease-out;

  @media (hover: hover) {
    &:hover {
      ${colorTransform};
    }
  }

  @media (hover: none) {
    &:active {
      ${colorTransform};
    }
  }
`;

export const PlayerRateWrapper = styled.div`
  padding-top: ${props => props.theme.spacingUnits['200']};
  grid-column: 3;
  display: flex;
  align-items: center;
  justify-content: end;
`;

export const colorTransformIconFill = css<{ $isDark: boolean }>`
  color: ${props => props.theme.color(props.$isDark ? 'yellow' : 'black')};
  transform: scale(1.1);

  .icon__playpause {
    fill: ${props =>
      props.theme.color(props.$isDark ? 'black' : 'transparent')};
  }
`;

export const TitleWrapper = styled.span<{ $isDark: boolean }>`
  color: ${props => props.theme.color(props.$isDark ? 'white' : 'black')};
`;

export const PlayPauseInner = styled.div<{ $isDark: boolean }>`
  color: ${props => props.theme.color(props.$isDark ? 'white' : 'black')};
  transition:
    color 0.2s ease-out,
    transform 0.2s ease-out;

  .icon__playpause {
    fill: ${props =>
      props.theme.color(props.$isDark ? 'black' : 'transparent')};
    transition: fill 0.2s ease-out;
  }

  @media (hover: hover) {
    &:hover {
      ${colorTransformIconFill};
    }
  }

  @media (hover: none) {
    &:active {
      ${colorTransformIconFill};
    }
  }
`;

export const AudioPlayerGrid = styled.div.attrs({})<{ $isEnhanced: boolean }>`
  display: ${props => (props.$isEnhanced ? 'grid' : 'none')};
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
`;

export const NowPlayingWrapper = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-top'] },
})`
  grid-column: 1 / -1;
`;
