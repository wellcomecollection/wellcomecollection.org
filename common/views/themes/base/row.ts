import { css } from 'styled-components';

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
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0wLDFsMTQyLjgsNTguMmMwLDAsNzQuNi0zNS43LDE2Ny00NC41YzAsMCwyMDEuMSw0Mi45LDI2MS45LDY4LjJTODgyLjksMTUsODgyLjksMTVMMTAwMCwxSDB6Ii8+PC9zdmc+');
      background-size: cover;
    }
  }
`;
