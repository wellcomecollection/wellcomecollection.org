import styled, { css } from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import {
  mediaBackgroundColor,
  ThemeColor,
} from '@weco/common/views/themes/config';

// Controls are blue.30 on dark backgrounds. On light ones they stay black, as
// blue.30 isn't accessible there.
export const controlColor = (isDark: boolean): ThemeColor =>
  isDark ? 'blue.30' : 'black';

export const AudioPlayerWrapper = styled(Space).attrs({
  as: 'figure',
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
})<{ $isDark: boolean }>`
  background: ${props =>
    props.theme.color(props.$isDark ? mediaBackgroundColor : 'transparent')};
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
  className: typography('body', 'sm', 'regular'),
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

export const hoverScale = css`
  transform: scale(1.1);
`;

export const SkipButton = styled.button<{ $isDark: boolean }>`
  padding: ${props => props.theme.spacingUnits['200']} 0 0;
  color: ${props => props.theme.color(controlColor(props.$isDark))};

  transition:
    color 0.2s ease-out,
    transform 0.2s ease-out;

  @media (hover: hover) {
    &:hover {
      ${hoverScale};
    }
  }

  @media (hover: none) {
    &:active {
      ${hoverScale};
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

export const hoverScaleIconFill = css<{ $isDark: boolean }>`
  transform: scale(1.1);

  .icon__playpause {
    fill: ${props =>
      props.theme.color(props.$isDark ? mediaBackgroundColor : 'transparent')};
  }
`;

export const TitleWrapper = styled.span<{ $isDark: boolean }>`
  color: ${props => props.theme.color(props.$isDark ? 'white' : 'black')};
`;

export const PlayPauseInner = styled.div<{ $isDark: boolean }>`
  color: ${props => props.theme.color(controlColor(props.$isDark))};
  transition:
    color 0.2s ease-out,
    transform 0.2s ease-out;

  .icon__playpause {
    fill: ${props =>
      props.theme.color(props.$isDark ? mediaBackgroundColor : 'transparent')};
    transition: fill 0.2s ease-out;
  }

  @media (hover: hover) {
    &:hover {
      ${hoverScaleIconFill};
    }
  }

  @media (hover: none) {
    &:active {
      ${hoverScaleIconFill};
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
