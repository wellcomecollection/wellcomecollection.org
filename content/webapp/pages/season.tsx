import { NextPageContext } from 'next';
import { ReactElement } from 'react';
import { SeasonWithContent } from '@weco/common/model/seasons';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import SeasonsHeader from '@weco/common/views/components/SeasonsHeader/SeasonsHeader';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { contentLd } from '@weco/common/utils/json-ld';
import Body from '@weco/common/views/components/Body/Body';
import { getSeasonWithContent } from '@weco/common/services/prismic/seasons';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import { convertJsonToDates } from './event';

const SeasonPage = ({
  season,
  articles,
  books,
  events,
  exhibitions,
}: SeasonWithContent): ReactElement<SeasonWithContent> => {
  const Header = (
    <SeasonsHeader
      labels={{ labels: season.labels }}
      title={season.title}
      FeaturedMedia={<UiImage {...season.widescreenImage} sizesQueries="" />}
      standfirst={season?.standfirst}
    />
  );
  const parsedEvents = events.map(convertJsonToDates);
  const parsedExhibitions = exhibitions.map(exhibition => {
    return {
      ...exhibition,
      start: exhibition.start && new Date(exhibition.start),
      end: exhibition.end && new Date(exhibition.end),
    };
  });
  return (
    <PageLayout
      title={season.title}
      description={season.metadataDescription || season.promoText || ''}
      url={{ pathname: `/seasons/${season.id}` }}
      jsonLd={contentLd(season)}
      siteSection={'whats-on'}
      openGraphType={'website'}
      imageUrl={season.image && convertImageUri(season.image.contentUrl, 800)}
      imageAltText={season?.image?.alt}
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
            <CardGrid items={parsedEvents} itemsPerRow={3} />
          </SpacingComponent>
        </SpacingSection>
      )}

      {(exhibitions.length > 0 ||
        articles.length > 0 ||
        books.length > 0) && (
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader title="Explore more" />
            </SpacingComponent>
            <SpacingComponent>
              <CardGrid
                items={[...parsedExhibitions, ...articles, ...books]}
                itemsPerRow={3}
              />
            </SpacingComponent>
          </SpacingSection>
        )}
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
    id: id?.toString() || '',
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
