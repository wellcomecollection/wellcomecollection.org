import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, ReactNode, SyntheticEvent } from 'react';

declare global {
  interface Document {
    startViewTransition: (cb: () => void) => void;
  }
}

type Props = LinkProps & { children: ReactNode };
const TransitionLink: FunctionComponent<Props> = ({
  href,
  children,
  ...props
}) => {
  const router = useRouter();

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!document.startViewTransition) {
      router.push(href);

      return;
    }

    document.startViewTransition(() => router.push(href));
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
