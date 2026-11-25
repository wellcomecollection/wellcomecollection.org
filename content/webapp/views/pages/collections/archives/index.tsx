import { NextPage } from 'next';

import PageLayout from '@weco/common/views/layouts/PageLayout';
import type { ArchiveCategory } from '@weco/content/services/wellcome/catalogue/archiveCategories';
import CollectionsHeader from '@weco/content/views/components/CollectionsHeader';

import ArchiveCategoriesList from './archives.ArchiveCategoriesList';

export type Props = {
  archiveCategories: ArchiveCategory[];
};

const ArchivesPage: NextPage<Props> = ({ archiveCategories }) => {
  return (
    <PageLayout
      title="Archives"
      description="Browse the archives held by Wellcome Collection."
      url={{ pathname: '/collections/archives' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="collections"
      headerProps={{ hasColorBackground: true }}
      hideNewsletterPromo
      clipOverflowX
    >
      <CollectionsHeader
        title="Archives"
        introText="We hold over 950 archive collections of personal papers and organisational records, including audio-visual and born-digital material. They include collections from individuals, organisations and healthcare providers, as well as Wellcome’s own history. Archive collections are organised by type, some of which are legacy and no longer actively collected into."
      />
      <ArchiveCategoriesList archiveCategories={archiveCategories} />
    </PageLayout>
  );
};

export default ArchivesPage;
