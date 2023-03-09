import NextLink, { LinkProps } from 'next/link';
import { FunctionComponent, ReactNode } from 'react';

type WorkLinkSource =
  | 'works_search_result'
  | 'images_search_result'
  | 'item_auth_modal_back_to_work_link'
  | 'archive_tree'
  | 'viewer_back_link'
  | 'viewer_credit';

// We remove `href` and `as` because we contruct those ourselves
// in the component.
type Props = {
  id: string;
  source: WorkLinkSource;
  resultPosition?: number;
  children: ReactNode;
} & Omit<LinkProps, 'as' | 'href'>;

const WorkLink: FunctionComponent<Props> = ({
  id,
  source,
  resultPosition,
  children,
  ...linkProps
}) => {
  return (
    <NextLink
      href={{
        pathname: '/works/[workId]',
        query: {
          workId: id,
          source,
          resultPosition,
        },
      }}
      as={{
        pathname: `/works/${id}`,
      }}
      {...linkProps}
      legacyBehavior
    >
      {children}
    </NextLink>
  );
};

export default WorkLink;
