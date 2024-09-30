import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SyntheticEvent } from 'react';
declare global {
  interface Document {
    startViewTransition: (cb: () => void) => void;
  }
}
const TransitionLink = ({ href, children, ...props }) => {
  const router = useRouter();

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault();

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
