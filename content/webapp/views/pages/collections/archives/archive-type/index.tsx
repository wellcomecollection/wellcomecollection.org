import { NextPage } from 'next';

import PageLayout from '@weco/common/views/layouts/PageLayout';
import type { ArchiveType } from '@weco/content/services/wellcome/catalogue/archiveTypes';
import type { ArchiveTypeWorksResult } from '@weco/content/services/wellcome/catalogue/works';
import CollectionsHeader from '@weco/content/views/components/CollectionsHeader';

import ArchiveTypeWorksList from './archive-type.WorksList';

export type Props = {
  archiveType: ArchiveType;
  works: ArchiveTypeWorksResult;
};

const ArchiveTypePage: NextPage<Props> = ({ archiveType, works }) => {
  return (
    <PageLayout
      title={archiveType.label}
      description={archiveType.description}
      url={{ pathname: `/collections/archives/${archiveType.slug}` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="collections"
      headerProps={{ hasColorBackground: true }}
      hideNewsletterPromo
      clipOverflowX
    >
      <CollectionsHeader
        title={`${archiveType.label} (${archiveType.id})`}
        introText={archiveType.description}
        extraBreadcrumbs={[{ url: '/collections/archives', text: 'Archives' }]}
      />
      <ArchiveTypeWorksList
        works={works}
        archiveTypeLabel={archiveType.label}
      />
    </PageLayout>
  );
};

export default ArchiveTypePage;
