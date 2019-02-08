// @flow

import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import type { Node } from 'react';

type Props = {|
  children: Node,
|};

const OutboundLinkTracker = ({ children }: Props) => {
  function getDomain(url: string): string {
    return url
      .replace('http://', '')
      .replace('https://', '')
      .split('/')[0];
  }

  function isExternal(url: string): boolean {
    return getDomain(document.location.href) !== getDomain(url);
  }

  function handleClick(event) {
    const href = event.target.href;

    if (href && isExternal(href)) {
      ReactGA.outboundLink(
        {
          label: href,
        },
        () => {} // ReactGA requires the hitCallback arg
      );
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  return <>{children}</>;
};

export default OutboundLinkTracker;
