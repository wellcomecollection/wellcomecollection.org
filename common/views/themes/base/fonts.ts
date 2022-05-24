import { css } from 'styled-components';
import { GlobalStyleProps } from '../default';

export const fonts = css<GlobalStyleProps>`
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    src: local(''),
      url('https://i.wellcomecollection.org/assets/fonts/inter-v11-vietnamese_latin-ext_latin_greek-ext_greek_cyrillic-ext_cyrillic-regular.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/inter-v11-vietnamese_latin-ext_latin_greek-ext_greek_cyrillic-ext_cyrillic-regular.woff')
        format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    src: local(''),
      url('https://i.wellcomecollection.org/assets/fonts/inter-v11-vietnamese_latin-ext_latin_greek-ext_greek_cyrillic-ext_cyrillic-700.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/inter-v11-vietnamese_latin-ext_latin_greek-ext_greek_cyrillic-ext_cyrillic-700.woff')
        format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: 'Wellcome Bold Web';
    src: url('https://i.wellcomecollection.org/assets/fonts/wellcome-bold.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/wellcome-bold.woff')
        format('woff');
    font-weight: bold;
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
    src: url('https://i.wellcomecollection.org/assets/fonts/lineto-lettera-regular.woff2')
        format('woff2'),
      url('https://i.wellcomecollection.org/assets/fonts/lineto-lettera-regular.woff')
        format('woff');
    font-weight: normal;
    font-style: normal;
  }
`;
