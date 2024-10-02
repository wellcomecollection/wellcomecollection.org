import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, ReactNode, SyntheticEvent } from 'react';

import { useToggles } from '@weco/common/server-data/Context';

declare global {
  interface Document {
    startViewTransition: (cb: () => void) => void;
  }
}

type Props = LinkProps & {
  children: ReactNode;
  style?: Record<string, string>;
  onFocus?: () => void;
};
const TransitionLink: FunctionComponent<Props> = ({
  href,
  children,
  ...props
}) => {
  const { viewTransitions } = useToggles();
  const router = useRouter();

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!document.startViewTransition || !viewTransitions) {
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
