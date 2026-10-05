import styled from 'styled-components';

import { getHeaderTexture } from '@weco/common/utils/backgrounds';
import { typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { PinnableColor } from '@weco/common/views/themes/config';

export const Container = styled.div<{ $backgroundTexture?: string }>`
  position: relative;
  background-image: ${props =>
    props.$backgroundTexture
      ? `url("${getHeaderTexture(props.$backgroundTexture, props.theme.brandUpdate)}")`
      : 'undefined'};
  background-size: ${props =>
    props.$backgroundTexture ? 'cover' : 'undefined'};
`;

export const Wrapper = styled(Space)<{ $isOnDarkHeader?: boolean }>`
  ${props =>
    props.$isOnDarkHeader &&
    props.theme.brandUpdate &&
    `color: ${props.theme.color({ brand: 'neutral.10', legacy: 'black' })};`}

  @media print {
    margin: 0;
    padding: 0;

    /* Browsers don't print the dark header background, so go back to dark text */
    ${props =>
      props.$isOnDarkHeader &&
      props.theme.brandUpdate &&
      `color: ${props.theme.color('black')};`}
  }
`;

export const TitleWrapper = styled.h1.attrs<{
  $isOfficialLandingPage?: boolean;
}>(props => ({
  className: props.$isOfficialLandingPage
    ? typography('display', 'md', 'strong')
    : typography('heading', 'xxl', 'strong', 'brand'),
}))`
  display: inline-block;
  margin: 0 !important;
`;

// The `bottom` values here are coupled to the space
// beneath the Header in ContentPage.tsx
export const headerSpaceSize = 'md';
export const HeroPictureBackground = styled.div.attrs({
  className: 'is-hidden-print',
})<{ $bgColor: PinnableColor }>`
  position: absolute;
  background-color: ${props => props.theme.color(props.$bgColor)};
  height: 50%;
  width: 100%;
  bottom: -${props => props.theme.getSpaceValue(headerSpaceSize, 'zero')};

  ${props =>
    props.theme.media('sm')(
      `bottom: -${props.theme.getSpaceValue(headerSpaceSize, 'sm')};`
    )}

  ${props =>
    props.theme.media('md')(
      `bottom: -${props.theme.getSpaceValue(headerSpaceSize, 'md')};`
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
