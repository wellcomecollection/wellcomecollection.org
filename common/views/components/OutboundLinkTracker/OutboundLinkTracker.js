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

  function handleClick(event: { target: any }) {
    const url = event.target.href;

    if (url && isExternal(url)) {
      ReactGA.outboundLink(
        {
          category: 'outbound',
          action: 'click',
          label: url,
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
