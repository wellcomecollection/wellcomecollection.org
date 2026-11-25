import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { ThemeColor } from '@weco/common/views/themes/config';

export const Container = styled.div<{ $backgroundTexture?: string }>`
  position: relative;
  background-image: ${props =>
    props.$backgroundTexture
      ? `url("${props.$backgroundTexture}")`
      : 'undefined'};
  background-size: ${props =>
    props.$backgroundTexture ? 'cover' : 'undefined'};
`;

export const Wrapper = styled(Space)<{ $isOnDarkHeader?: boolean }>`
  ${props =>
    props.$isOnDarkHeader && `color: ${props.theme.color('neutral.10')};`}

  @media print {
    margin: 0;
    padding: 0;

    /* Browsers don't print the dark header background, so go back to dark text */
    ${props => props.$isOnDarkHeader && `color: ${props.theme.color('black')};`}
  }
`;

export const TitleWrapper = styled.h1.attrs<{
  $isLandingPage?: boolean;
}>(props => ({
  className: props.$isLandingPage
    ? typography('display', 'md', 'strong')
    : typography('heading', 'xxl', 'strong', 'brand'),
}))`
  display: inline-block;
  margin: 0 !important;
`;

// The `bottom` values here are coupled to the space
// beneath the Header in ContentPage.tsx
export const HEADER_SPACE_SIZE = 'md';
export const HeroPictureBackground = styled.div.attrs({
  className: 'is-hidden-print',
})<{ $bgColor: ThemeColor }>`
  position: absolute;
  background-color: ${props => props.theme.color(props.$bgColor)};
  height: 50%;
  width: 100%;
  bottom: -${props => props.theme.getSpaceValue(HEADER_SPACE_SIZE, 'zero')};

  ${props =>
    props.theme.media('sm')(
      `bottom: -${props.theme.getSpaceValue(HEADER_SPACE_SIZE, 'sm')};`
    )}

  ${props =>
    props.theme.media('md')(
      `bottom: -${props.theme.getSpaceValue(HEADER_SPACE_SIZE, 'md')};`
    )}
`;

export const HeroPictureContainer = styled.div`
  max-width: 1450px;
  margin: 0 auto;

  ${props =>
    props.theme.media('sm')`
      padding-left: 24px;
      padding-right: 24px;
    `}
`;
