// @flow
import styled from 'styled-components';
import lighten from 'polished';
import type { ComponentType } from 'react';

const TopBar: ComponentType<> = styled.div`
  position: relative;
  z-index: 2;
  background: ${props => lighten(0.14, props.theme.colors.viewerBlack)};
  color: ${props => props.theme.colors.white};
  .title {
    max-width: 30%;
  }
  h1 {
    margin: 0;
  }
  .part {
    max-width: 100%;
    display: block;
    @media (min-width: ${props => props.theme.sizes.large}px) {
      display: none;
    }
  }
  .plain-link {
    max-width: 100%;
  }
  .icon__shape {
    fill: currentColor;
  }
  button {
    overflow: hidden;
    display: inline-block;
    .icon {
      margin: 0;
      @media (min-width: ${props => props.theme.sizes.large}px) {
        margin-right: ${props => `${props.theme.spacingUnit}px`};
      }
    }
    .btn__text {
      position: absolute;
      right: 100%;
      @media (min-width: ${props => props.theme.sizes.large}px) {
        position: static;
      }
    }
    @media (min-width: ${props => props.theme.sizes.large}px) {
      width: 130px;
    }
  }
`;

export default TopBar;
