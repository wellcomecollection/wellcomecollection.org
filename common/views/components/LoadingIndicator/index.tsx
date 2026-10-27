import Router from 'next/router';
import NProgress from 'nprogress';
import { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

const LoadingIndicatorWrapper = styled.div.attrs({
  className: 'loading-indicator-wrapper',
})`
  #nprogress {
    pointer-events: none;
  }

  #nprogress .bar {
    background: ${props => props.theme.color({ brand: 'pink.30', legacy: 'yellow' })};
    position: fixed;
    z-index: ${props => props.theme.zIndex.loadingIndicator};
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
  }

  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0;
    width: 100px;
    height: 100%;
    box-shadow:
      0 0 10px
        ${props => props.theme.color({ brand: 'pink.30', legacy: 'yellow' })},
      0 0 5px
        ${props => props.theme.color({ brand: 'pink.30', legacy: 'yellow' })};
    opacity: 1;
    transform: rotate(3deg) translate(0, -4px);
  }
`;

const LoadingIndicator: FunctionComponent = () => {
  function handleRouteChangeStart() {
    NProgress.start();
  }

  function handleRouteChangeComplete() {
    NProgress.done();
  }
  useEffect(() => {
    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  NProgress.configure({
    showSpinner: false,
    parent: '.loading-indicator-wrapper',
    // NProgress's default markup uses role="bar", which isn't a valid ARIA
    // role, so find the bar by a data attribute instead
    template:
      '<div class="bar" data-nprogress-bar><div class="peg"></div></div>',
    barSelector: '[data-nprogress-bar]',
  });

  // The bar is purely visual
  return (
    <LoadingIndicatorWrapper data-component="loading-indicator" aria-hidden />
  );
};

export default LoadingIndicator;
