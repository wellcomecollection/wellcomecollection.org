import { themeValues } from '@weco/common/views/themes/config';
import styled from 'styled-components';

export const Container = styled.div`
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
