import { NextPage } from 'next';

import { SiteSection } from '@weco/common/model/site-section';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { Props as PagePageProps } from '@weco/content/views/pages/pages/page';

const CollectionsLandingPage: NextPage<PagePageProps> = ({
  page,
  // siblings,
  // children,
  // ordersInParents,
  // staticContent,
  jsonLd,
}) => {
  return (
    <PageLayout
      title={page.title}
      description={page.metadataDescription || page.promo?.caption || ''}
      url={{
        pathname: `${page?.siteSection ? '/' + page.siteSection : ''}/${page.uid}`,
      }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection={page?.siteSection as SiteSection}
      image={page.image}
      apiToolbarLinks={[createPrismicLink(page.id)]}
      isNoIndex // TODO remove when this becomes the page
      hideNewsletterPromo
    >
      <PageHeader
        variant="simpleLanding"
        title={page.title}
        introText={page.introText}
      />
    </PageLayout>
  );
};

export default CollectionsLandingPage;
