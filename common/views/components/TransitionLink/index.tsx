import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SyntheticEvent } from 'react';

import { useToggles } from '@weco/common/server-data/Context';

declare global {
  interface Document {
    startViewTransition: (cb: () => void) => void;
  }
}
const TransitionLink = ({ href, children, ...props }) => {
  const router = useRouter();
  const { viewTransitions } = useToggles();

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!document.startViewTransition || !viewTransitions) {
      router.push(href);

      return;
    }

    document.startViewTransition(() => {
      return new Promise(resolve => {
        router.push(href);

        window.addEventListener('message', event => {
          if (event.data !== 'routechangecomplete') return;
          resolve('route changed');
        });
      });
    });
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
