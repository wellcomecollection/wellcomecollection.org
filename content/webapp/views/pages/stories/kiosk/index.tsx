import PageLayout from '@weco/common/views/layouts/PageLayout';
import { Page } from '@weco/content/types/pages';

export type Props = {
  page: Page;
};

const KioskStoriesListingPage = ({ page }: Props) => {
  return (
    <PageLayout
      openGraphType={'website' as const}
      jsonLd={[]}
      siteSection="stories"
      title={page.title}
      description={page.metadataDescription || page.promo?.caption || ''}
      url={{ pathname: '/stories/kiosk' }}
      image={page.image}
      apiToolbarLinks={[]} // TODO add Edit Prismic page
      headerProps={{ hasColorBackground: true }}
      clipOverflowX
      hideNewsletterPromo
      hideFooter
      hideHeader
      isNoIndex
    >
      <h1>Kiosk Stories Listing Page</h1>
      {/* Content for listing kiosk stories goes here */}
    </PageLayout>
  );
};

export default KioskStoriesListingPage;
