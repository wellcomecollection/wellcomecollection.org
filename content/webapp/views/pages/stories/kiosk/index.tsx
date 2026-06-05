import { SliceZone } from '@prismicio/react';

import {
  PagesDocumentDataBodySlice,
  CardListingSlice as RawCardListingSlice,
} from '@weco/common/prismicio-types';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
import { Page } from '@weco/content/types/pages';

export type Props = {
  page: Page;
};

const KioskStoriesListingPage = ({ page }: Props) => {
  const cardListingSlices = page.untransformedBody.filter(
    (slice: PagesDocumentDataBodySlice): slice is RawCardListingSlice =>
      slice.slice_type === 'cardListing'
  );

  return (
    <PageLayout
      openGraphType={'website' as const}
      jsonLd={[]}
      siteSection="stories"
      title={page.title}
      description={page.metadataDescription || page.promo?.caption || ''}
      url={{ pathname: '/stories/kiosk' }}
      image={page.image}
      apiToolbarLinks={[createPrismicLink(page.id)]}
      clipOverflowX
      hideNewsletterPromo
      hideFooter
      hideHeader
      isNoIndex
    >
      <PageHeader
        variant="landing"
        title={page.title}
        introText={page.introText}
      />

      <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
        <SliceZone
          slices={cardListingSlices}
          components={components}
          context={{
            itemsHaveTransparentBackground: true,
            cardSizeMap: { s: [12], m: [6], l: [6], xl: [6] },
          }}
        />
      </Space>
    </PageLayout>
  );
};

export default KioskStoriesListingPage;
