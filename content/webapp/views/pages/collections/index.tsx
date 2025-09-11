import * as prismic from '@prismicio/client';
import { NextPage } from 'next';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { ImageType } from '@weco/common/model/image';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { useCollectionStats } from '@weco/content/hooks/useCollectionStats';
import { MultiContent } from '@weco/content/types/multi-content';
import CardGrid from '@weco/content/views/components/CardGrid';
import SectionHeader from '@weco/content/views/components/SectionHeader';

export type Props = {
  pageMeta: {
    id: string;
    image?: ImageType;
    description?: string;
  };
  title: string;
  introText: prismic.RichTextField;
  insideOurCollectionsCards: MultiContent[];
  // jsonLd: JsonLdObj[]; ??
};

const CollectionsLandingPage: NextPage<Props> = ({
  pageMeta,
  title,
  introText,
  insideOurCollectionsCards,
}) => {
  const { data: collectionStats } = useCollectionStats();

  return (
    <PageLayout
      title="Collections"
      description={pageMeta.description || pageDescriptions.collections}
      url={{ pathname: '/collections' }}
      jsonLd={[]} // TODO?
      openGraphType="website"
      siteSection="collections"
      image={pageMeta.image}
      apiToolbarLinks={[createPrismicLink(pageMeta.id)]}
      isNoIndex // TODO remove when this becomes the page
      hideNewsletterPromo
    >
      <PageHeader variant="simpleLanding" title={title} introText={introText} />

      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <SectionHeader title="Inside our collections" gridSize={gridSize12()} />
        <ContaineredLayout gridSizes={gridSize12()}>
          <p>
            Explore stories inspired by the objects, manuscripts and archives in
            our collection
          </p>
        </ContaineredLayout>

        <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
          <CardGrid
            items={insideOurCollectionsCards}
            itemsPerRow={3}
            itemsHaveTransparentBackground
            links={[
              {
                text: 'Read all stories',
                url: '/series/inside-our-collections',
              },
            ]}
          />
        </Space>
      </Space>

      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <SectionHeader
          title="Types of materials in the collections"
          gridSize={gridSize12()}
        />
        <ContaineredLayout gridSizes={gridSize12()}>
          <div>
            <ul>
              <li>
                <div>
                  <strong>
                    {collectionStats.booksAndJournals.count !== null
                      ? collectionStats.booksAndJournals.count.toLocaleString()
                      : `${collectionStats.booksAndJournals.fallbackCount.toLocaleString()}+`}
                  </strong>
                </div>
                <div>{collectionStats.booksAndJournals.label}</div>
              </li>
              <li>
                <div>
                  <strong>
                    {collectionStats.images.count !== null
                      ? collectionStats.images.count.toLocaleString()
                      : `${collectionStats.images.fallbackCount.toLocaleString()}+`}
                  </strong>
                </div>
                <div>{collectionStats.images.label}</div>
              </li>
              <li>
                <div>
                  <strong>
                    {collectionStats.archivesAndManuscripts.count !== null
                      ? collectionStats.archivesAndManuscripts.count.toLocaleString()
                      : `${collectionStats.archivesAndManuscripts.fallbackCount.toLocaleString()}+`}
                  </strong>
                </div>
                <div>{collectionStats.archivesAndManuscripts.label}</div>
              </li>
              <li>
                <div>
                  <strong>
                    {collectionStats.audioAndVideo.count !== null
                      ? collectionStats.audioAndVideo.count.toLocaleString()
                      : `${collectionStats.audioAndVideo.fallbackCount.toLocaleString()}+`}
                  </strong>
                </div>
                <div>{collectionStats.audioAndVideo.label}</div>
              </li>
              <li>
                <div>
                  <strong>
                    {collectionStats.ephemera.count !== null
                      ? collectionStats.ephemera.count.toLocaleString()
                      : `${collectionStats.ephemera.fallbackCount.toLocaleString()}+`}
                  </strong>
                </div>
                <div>{collectionStats.ephemera.label}</div>
              </li>
            </ul>
          </div>
        </ContaineredLayout>
      </Space>
    </PageLayout>
  );
};

export default CollectionsLandingPage;
