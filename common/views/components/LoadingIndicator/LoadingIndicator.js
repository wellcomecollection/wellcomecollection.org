// @flow

import { useEffect } from 'react';
import NProgress from 'nprogress';
import Router from 'next/router';
import theme from '../../themes/default';

const LoadingIndicator = () => {
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
  const color = theme.colors.yellow;
  const height = 2;

  NProgress.configure({ showSpinner: false });

  return (
    <style jsx global>{`
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: ${color};
        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;
        width: 100%;
        height: ${height}px;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
        opacity: 1;
        -webkit-transform: rotate(3deg) translate(0px, -4px);
        -ms-transform: rotate(3deg) translate(0px, -4px);
        transform: rotate(3deg) translate(0px, -4px);
      }
    `}</style>
  );
};

export default LoadingIndicator;
