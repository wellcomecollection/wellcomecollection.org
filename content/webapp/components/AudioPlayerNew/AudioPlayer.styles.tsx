import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const AudioPlayerWrapper = styled(Space).attrs({
  as: 'figure',
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})<{ $isDark: boolean }>`
  background: ${props =>
    props.$isDark ? props.theme.color('black') : props.theme.color('white')};
  margin: 0;
`;

type PlayPauseButtonProps = { $isPlaying: boolean };
export const PlayPauseButton = styled.button.attrs<PlayPauseButtonProps>(
  props => ({
    'aria-pressed': props.$isPlaying,
  })
)<PlayPauseButtonProps>`
  padding: ${props => props.theme.spacingUnits['5']}px
    ${props => props.theme.spacingUnits['6']}px 0;
`;

export const TimeWrapper = styled.div.attrs({
  className: font('intr', 6),
})<{ $isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  font-variant-numeric: tabular-nums;
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
`;

export const SkipPlayWrapper = styled.div`
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const colorTransform = css<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('yellow') : props.theme.color('black')};
  transform: scale(1.1);
`;

export const SkipButton = styled.button<{ $isDark: boolean }>`
  padding: ${props => props.theme.spacingUnits['5']}px 0 0;
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};

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
  padding-top: ${props => props.theme.spacingUnits['5']}px;
  grid-column: 3;
  display: flex;
  align-items: center;
  justify-content: end;
`;

export const colorTransformIconFill = css<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('yellow') : props.theme.color('black')};
  transform: scale(1.1);

  .icon__playpause {
    fill: ${props =>
      props.$isDark ? props.theme.color('black') : props.theme.color('white')};
  }
`;

export const TitleWrapper = styled.span<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
`;

export const PlayPauseInner = styled.div<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
  transition:
    color 0.2s ease-out,
    transform 0.2s ease-out;

  .icon__playpause {
    fill: ${props =>
      props.$isDark ? props.theme.color('black') : props.theme.color('white')};
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
  $v: { size: 's', properties: ['margin-top'] },
})`
  grid-column: 1 / -1;
`;
