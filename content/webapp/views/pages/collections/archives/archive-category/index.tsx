import { NextPage } from 'next';

import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import type { ArchiveCategory } from '@weco/content/services/wellcome/catalogue/archiveCategories';
import type { ArchiveCategoryWorksResult } from '@weco/content/services/wellcome/catalogue/works';
import CollectionsHeader from '@weco/content/views/components/CollectionsHeader';

import ArchiveCategoryWorksList from './archive-category.WorksList';

export type Props = {
  archiveCategory: ArchiveCategory;
  works: ArchiveCategoryWorksResult;
  sort?: string;
  sortOrder?: string;
  apiToolbarLinks: ApiToolbarLink[];
};

const ArchiveCategoryPage: NextPage<Props> = ({
  archiveCategory,
  works,
  sort,
  sortOrder,
  apiToolbarLinks,
}) => {
  return (
    <PageLayout
      title={archiveCategory.label}
      description={archiveCategory.description}
      url={{ pathname: `/collections/archives/${archiveCategory.slug}` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="collections"
      headerProps={{ hasColorBackground: true }}
      hideNewsletterPromo
      clipOverflowX
      apiToolbarLinks={apiToolbarLinks}
    >
      <CollectionsHeader
        title={`${archiveCategory.label} (${archiveCategory.id})`}
        introText={archiveCategory.description}
        extraBreadcrumbs={[{ url: '/collections/archives', text: 'Archives' }]}
      />
      <ArchiveCategoryWorksList
        works={works}
        archiveCategoryLabel={archiveCategory.label}
        sort={sort}
        sortOrder={sortOrder}
      />
    </PageLayout>
  );
};

export default ArchiveCategoryPage;
