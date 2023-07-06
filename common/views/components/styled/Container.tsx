import { themeValues } from '@weco/common/views/themes/config';
import styled, { css } from 'styled-components';

export const containerStyles = css`
  margin: 0 auto;
  width: 100%;
  max-width: ${themeValues.sizes.xlarge}px;
  padding: 0 ${themeValues.containerPadding.small}px;

  ${themeValues.media('medium')(`
    padding: 0 ${themeValues.containerPadding.medium}px;
  `)}

  ${themeValues.media('large')(`
    padding: 0 ${themeValues.containerPadding.large}px;
  `)}
`;

export const Container = styled.div`
  ${containerStyles}
`;
