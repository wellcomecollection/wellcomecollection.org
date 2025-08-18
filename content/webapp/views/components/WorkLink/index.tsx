import NextLink, { LinkProps } from 'next/link';
import { FunctionComponent, PropsWithChildren } from 'react';

// We remove `href` and `as` because we contruct those ourselves
// in the component.
type Props = PropsWithChildren<{
  id: string;
}> &
  Omit<LinkProps, 'href'>;

const WorkLink: FunctionComponent<Props> = ({ id, children, ...linkProps }) => {
  return (
    <NextLink
      data-component="work-link"
      href={{
        pathname: '/works/[workId]',
        query: { workId: id },
      }}
      {...linkProps}
      legacyBehavior
    >
      {children}
    </NextLink>
  );
};

export default WorkLink;
