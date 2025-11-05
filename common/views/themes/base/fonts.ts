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
    font-weight: 500;
    src:
      url('https://i.wellcomecollection.org/assets/fonts/Inter-Medium.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/Inter-Medium.woff')
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
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    src:
      url('https://i.wellcomecollection.org/assets/fonts/Inter-Bold.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/Inter-Bold.woff')
        format('woff');
    font-display: swap;
  }

  @font-face {
    font-family: 'Wellcome Bold Web';
    src:
      url('https://i.wellcomecollection.org/assets/fonts/wellcome-bold.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/wellcome-bold.woff')
        format('woff');
    font-weight: bold;
    font-style: normal;
  }

  /* This is a duplicate declation of the block above, but with the font-family changed to match what's exported from the design system */
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

  /*
 * Legal Disclaimer
 *
 * These Fonts are licensed only for use on these domains and their subdomains:
 * wellcomecollection.org
 *
 * It is illegal to download or use them on other websites.
 *
 * While the @font-face statements below may be modified by the client, this
 * disclaimer may not be removed.
 *
 * Lineto.com, 2016
 */
  @font-face {
    font-family: 'Lettera Regular Web';
    src:
      url('https://i.wellcomecollection.org/assets/fonts/lineto-lettera-regular.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/lineto-lettera-regular.woff')
        format('woff');
    font-weight: normal;
    font-style: normal;
  }
`;
