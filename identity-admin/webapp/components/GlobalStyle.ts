import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Wellcome Bold";
    src: url("https://i.wellcomecollection.org/assets/fonts/wellcome-bold.woff2") format("woff2"),
      url("https://i.wellcomecollection.org/assets/fonts/wellcome-bold.woff") format("woff");
  }

  @font-face {
    font-family: "Lettera Regular";
    src: url("https://i.wellcomecollection.org/assets/fonts/lineto-lettera-regular.woff2") format("woff2"),
      url("https://i.wellcomecollection.org/assets/fonts/lineto-lettera-regular.woff") format("woff");
  }

  body {
    font-family: "Helvetica Neue Light Web", HelveticaNeue-Light, "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "Wellcome Bold", sans-serif;
  }
`;
