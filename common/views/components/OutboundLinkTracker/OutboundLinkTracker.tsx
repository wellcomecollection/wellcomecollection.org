import React, { FunctionComponent, ReactNode, useEffect } from 'react';
import ReactGA from 'react-ga';
import { isExternal } from '../../../utils/domain';

type Props = {
  children: ReactNode;
};

const OutboundLinkTracker: FunctionComponent<Props> = ({ children }: Props) => {
  function handleClick(event: MouseEvent) {
    if (event.target instanceof HTMLAnchorElement) {
      const url = event.target.href;

      if (isExternal(url)) {
        ReactGA.outboundLink(
          {
            label: url,
          },
          () => {
            // ReactGA requires the hitCallback arg
          }
        );
      }
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
