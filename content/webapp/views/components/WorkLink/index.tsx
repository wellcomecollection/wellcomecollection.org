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

function toWorkLink(props: Props): LinkProps {
  const { id, ...rest } = props;

  return {
    href: {
      pathname: '/works/[workId]',
      query: { workId: id },
    },
    ...rest,
  };
}

const WorkLink: FunctionComponent<Props> = ({ children, ...props }) => {
  const { id, ...rest } = props;

  return (
    <NextLink data-component="work-link" {...toWorkLink(props)} {...rest}>
      {children}
    </NextLink>
  );
};

export default WorkLink;
export { toWorkLink };
