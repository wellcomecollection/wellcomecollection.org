import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

export const Container = styled.div<{ $backgroundTexture?: string }>`
  position: relative;
  background-image: ${props =>
    props.$backgroundTexture
      ? `url(${props.$backgroundTexture})`
      : 'undefined'};
  background-size: ${props =>
    props.$backgroundTexture ? 'cover' : 'undefined'};
`;

export const Wrapper = styled(Space)`
  @media print {
    margin: 0;
    padding: 0;
  }
`;

export const TitleWrapper = styled.h1.attrs<{
  $sectionLevelPage?: boolean;
}>(props => ({
  className: font('wb', props.$sectionLevelPage ? 0 : 1),
}))`
  display: inline-block;
  margin: 0 !important;
`;

// The `bottom` values here are coupled to the space
// beneath the Header in ContentPage.tsx
export const headerSpaceSize = 'l';
export const HeroPictureBackground = styled.div.attrs({
  className: 'is-hidden-print',
})<{ $bgColor: PaletteColor }>`
  position: absolute;
  background-color: ${props => props.theme.color(props.$bgColor)};
  height: 50%;
  width: 100%;
  bottom: -${props => props.theme.spaceAtBreakpoints.small[headerSpaceSize]}px;

  ${props =>
    props.theme.media('medium')(
      `bottom: -${props.theme.spaceAtBreakpoints.medium[headerSpaceSize]}px;`
    )}

  ${props =>
    props.theme.media('large')(
      `bottom: -${props.theme.spaceAtBreakpoints.large[headerSpaceSize]}px;`
    )}
`;

export const HeroPictureContainer = styled.div`
  max-width: 1450px;
  margin: 0 auto;

  ${props =>
    props.theme.media('medium')`
      padding-left: 24px;
      padding-right: 24px;
    `}
`;
