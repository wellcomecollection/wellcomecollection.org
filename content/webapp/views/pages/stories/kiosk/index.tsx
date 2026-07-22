import { SliceZone } from '@prismicio/react';

import {
  PagesDocumentDataBodySlice,
  CardListingSlice as RawCardListingSlice,
} from '@weco/common/prismicio-types';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import Layout from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
import { STORIES_KIOSK_QR_CODE } from '@weco/content/constants/qr-codes';
import { Page } from '@weco/content/types/pages';
import InfoBlock from '@weco/content/views/components/InfoBlock';

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
            itemsHaveTransparentBackground: false,
            cardSizeMap: { s: [12], m: [6], l: [6], xl: [6] },
          }}
        />
        <Container>
          <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
            <Layout gridSizes={{ s: [12], m: [10], l: [7], xl: [7] }}>
              <InfoBlock
                {...{
                  title: 'Scan for more',
                  text: [
                    {
                      type: 'paragraph',
                      text: 'Explore over 1,000 stories on health and human experience at wellcomecollection.org/stories',
                      spans: [],
                      direction: 'ltr',
                    },
                  ],
                  image: {
                    url: STORIES_KIOSK_QR_CODE,
                    width: 200,
                    height: 200,
                    alt: 'QR code for wellcomecollection.org/stories',
                  },
                }}
              />
            </Layout>
          </Space>
        </Container>
      </Space>
    </PageLayout>
  );
};

export default KioskStoriesListingPage;
