import NextLink, { LinkProps } from 'next/link';
import { FunctionComponent, PropsWithChildren } from 'react';

type WorkLinkSource =
  | 'works_search_result'
  | 'expanded_image_more_link'
  | 'item_auth_modal_back_to_work_link'
  | 'archive_tree';

// We remove `href` and `as` because we contruct those ourselves
// in the component.
type Props = {
  id: string;
  source: WorkLinkSource;
} & Omit<LinkProps, 'as' | 'href'>;

const WorkLink: FunctionComponent<PropsWithChildren<Props>> = ({
  id,
  source,
  children,
  ...linkProps
}: PropsWithChildren<Props>) => {
  return (
    <NextLink
      href={{
        pathname: `/work`,
        query: {
          id,
          source,
        },
      }}
      as={{
        pathname: `/works/${id}`,
      }}
      {...linkProps}
    >
      {children}
    </NextLink>
  );
};

export default WorkLink;
