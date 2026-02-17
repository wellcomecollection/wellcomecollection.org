import { css } from 'styled-components';

import { GlobalStyleProps } from '@weco/common/views/themes/default';

export const fonts = css<GlobalStyleProps>`
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    src:
      url('https://i.wellcomecollection.org/assets/fonts/Inter-Regular.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/Inter-Regular.woff')
        format('woff');
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    src:
      url('https://i.wellcomecollection.org/assets/fonts/Inter-SemiBold.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/Inter-SemiBold.woff')
        format('woff');
    font-display: swap;
  }

  @font-face {
    font-family: 'Wellcome';
    src:
      url('https://i.wellcomecollection.org/assets/fonts/wellcome-bold.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/wellcome-bold.woff')
        format('woff');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: 'Wellcome';
    src:
      url('https://i.wellcomecollection.org/assets/fonts/Wellcome-Regular.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/Wellcome-Regular.woff')
        format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'IBM Plex Mono';
    src: url('https://i.wellcomecollection.org/assets/fonts/IBMPlexMono-Regular.woff2');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'IBM Plex Mono';
    src: url('https://i.wellcomecollection.org/assets/fonts/IBMPlexMono-SemiBold.woff2');
    font-weight: 600;
    font-style: normal;
  }
`;
