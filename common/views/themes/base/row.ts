import { css } from 'styled-components';

const wobblyBgUrl = (fill: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><path fill="${fill}" d="M0,1l142.8,58.2c0,0,74.6-35.7,167-44.5c0,0,201.1,42.9,261.9,68.2S882.9,15,882.9,15L1000,1H0z"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

export const row = css`
  .row--has-wobbly-background {
    position: relative;
    z-index: 0;
  }

  .row__wobbly-background {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    height: 15%;
    transition: height 600ms ease;
    background: ${props => props.theme.color('white')};

    &::after {
      position: absolute;
      height: 10vw;
      top: 100%;
      left: 0;
      right: 0;
      content: '';
      margin-top: -5px;
      background-image: ${wobblyBgUrl('#ffffff')};
      background-size: cover;

      @media (prefers-color-scheme: dark) {
        background-image: ${wobblyBgUrl('#121212')};
      }
    }
  }
`;
