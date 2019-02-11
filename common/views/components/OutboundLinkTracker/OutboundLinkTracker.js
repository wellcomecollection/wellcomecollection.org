// @flow

import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import type { Node } from 'react';
import { isExternal } from '../../../utils/domain';

type Props = {|
  children: Node,
|};

const OutboundLinkTracker = ({ children }: Props) => {
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
    // TODO:decouple this from the document for testing
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  return <>{children}</>;
};

export default OutboundLinkTracker;
