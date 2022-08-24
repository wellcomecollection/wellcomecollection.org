import { FC, useEffect } from 'react';
import NProgress from 'nprogress';
import Router from 'next/router';
import styled from 'styled-components';

const LoadingIndicatorWrapper = styled.div.attrs({
  className: 'loading-indicator-wrapper',
})`
  #nprogress {
    pointer-events: none;
  }
  #nprogress .bar {
    background: ${props => props.theme.color('yellow')};
    position: fixed;
    z-index: 1031;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
  }
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px ${props => props.theme.color('yellow')},
      0 0 5px ${props => props.theme.color('yellow')};
    opacity: 1;
    transform: rotate(3deg) translate(0px, -4px);
  }
`;

const LoadingIndicator: FC = () => {
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
  });

  return <LoadingIndicatorWrapper />;
};

export default LoadingIndicator;
