import NextLink, { LinkProps } from 'next/link';
import {
  AnchorHTMLAttributes,
  FunctionComponent,
  PropsWithChildren,
} from 'react';

// We remove `href` because we contruct those ourselves
// in the component.
type Props = PropsWithChildren<{
  id: string;
}> &
  Omit<LinkProps, 'href'> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

function toWorksLink(props: Props): LinkProps {
  return {
    href: {
      pathname: '/works/[workId]',
      query: { workId: props.id },
    },
    ...props,
  };
}

const WorkLink: FunctionComponent<Props> = ({ children, ...props }) => {
  return <NextLink {...toWorksLink(props)}>{children}</NextLink>;
};

export default WorkLink;
export { toWorksLink };
