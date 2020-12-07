import { NextPageContext } from 'next';
import { ReactElement } from 'react';
import { SeasonWithContent } from '@weco/common/model/seasons';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import PageHeader, {
  getFeaturedMedia,
} from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { contentLd } from '@weco/common/utils/json-ld';
import Body from '@weco/common/views/components/Body/Body';
import { getSeasonWithContent } from '@weco/common/services/prismic/seasons';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';

const SeasonPage = ({
  season,
  articles,
  books,
  events,
  exhibitions,
}: SeasonWithContent): ReactElement<SeasonWithContent> => {
  const genericFields = {
    id: season.id,
    title: season.title,
    contributors: season.contributors,
    contributorsTitle: season.contributorsTitle,
    promo: season.promo,
    body: season.body,
    standfirst: season.standfirst,
    promoImage: season.promoImage,
    promoText: season.promoText,
    image: season.image,
    squareImage: season.squareImage,
    widescreenImage: season.widescreenImage,
    labels: season.labels,
    metadataDescription: season.metadataDescription,
  };

  const ContentTypeInfo = season.standfirst && (
    <PageHeaderStandfirst html={season.standfirst} />
  );
  const FeaturedMedia = getFeaturedMedia(genericFields);
  const Header = (
    <PageHeader
      breadcrumbs={{ items: [] }}
      labels={{ labels: season.labels }}
      title={season.title}
      ContentTypeInfo={ContentTypeInfo}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      FeaturedMedia={FeaturedMedia}
      HeroPicture={null}
    />
  );

  return (
    <PageLayout
      title={season.title}
      description={season.metadataDescription || season.promoText || ''}
      url={{ pathname: `/seasons/${season.id}` }}
      jsonLd={contentLd(season)}
      siteSection={'whats-on'}
      openGraphType={'website'}
      imageUrl={season.image && convertImageUri(season.image.contentUrl, 800)}
      imageAltText={season.image && season.image.alt}
    >
      <ContentPage
        id={season.id}
        Header={Header}
        Body={<Body body={season.body} pageId={season.id} />}
      />

      {events.length > 0 && (
        <SpacingSection>
          <SpacingComponent>
            <SectionHeader title="Events" />
          </SpacingComponent>
          <SpacingComponent>
            <CardGrid items={events} itemsPerRow={4} />
          </SpacingComponent>
        </SpacingSection>
      )}
      {exhibitions.length > 0 ||
        articles.length > 0 ||
        (books.length > 0 && (
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader title="Explore more" />
            </SpacingComponent>
            <SpacingComponent>
              <CardGrid
                items={[...exhibitions, ...articles, ...books]}
                itemsPerRow={4}
              />
            </SpacingComponent>
          </SpacingSection>
        ))}
    </PageLayout>
  );
};

SeasonPage.getInitialProps = async (
  ctx: NextPageContext
): Promise<SeasonWithContent | { statusCode: number }> => {
  const { id } = ctx.query;
  const { memoizedPrismic } = (ctx.query.memoizedPrismic as unknown) as Record<
    string,
    unknown
  >;
  const seasonWithContent = await getSeasonWithContent({
    request: ctx.req,
    id: Array.isArray(id) ? id[0] : id,
    memoizedPrismic: Array.isArray(memoizedPrismic)
      ? memoizedPrismic[0]
      : memoizedPrismic,
  });

  if (seasonWithContent) {
    return seasonWithContent;
  } else {
    return { statusCode: 404 };
  }
};

export default SeasonPage;
