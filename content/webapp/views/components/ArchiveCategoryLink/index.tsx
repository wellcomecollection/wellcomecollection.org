import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { LinkProps } from '@weco/common/model/link-props';
import { LinkFrom } from '@weco/common/utils/routes';

// Takes the category's slug (its lowercased ID, see ArchiveCategory) rather
// than the raw API ID, so only a category we've looked up in the archive
// category list gets a link
type ArchiveCategoryLinkProps = { slug: string };

// Unlike ConceptLink/WorkLink this uses the real path rather than the route
// pattern plus a query. The category page also passes it to PageLayout as its
// `url`, which is turned straight into the canonical URL, where
// `/collections/archives/[id]?id=pp` would be wrong.
function toArchiveCategoryLink({ slug }: ArchiveCategoryLinkProps): LinkProps {
  return {
    href: {
      pathname: `/collections/archives/${slug}`,
    },
  };
}

const ArchiveCategoryLink: FunctionComponent<
  LinkFrom<ArchiveCategoryLinkProps>
> = ({ children, slug, ...props }) => {
  return (
    <NextLink
      data-component="archive-category-link"
      {...toArchiveCategoryLink({ slug })}
      {...props}
    >
      {children}
    </NextLink>
  );
};

export default ArchiveCategoryLink;
export { toArchiveCategoryLink };
