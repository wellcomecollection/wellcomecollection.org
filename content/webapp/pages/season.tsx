import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { SeasonWithContent } from '@weco/common/model/seasons';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import SeasonsHeader from '@weco/content/components/SeasonsHeader/SeasonsHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { contentLd } from '@weco/common/utils/json-ld';
import { removeUndefinedProps } from '@weco/common/utils/json';
import Body from '@weco/common/views/components/Body/Body';
import { getSeasonWithContent } from '@weco/common/services/prismic/seasons';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { convertJsonToDates } from './event';
import {
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import { getServerData } from '@weco/common/server-data';
import CardGrid from '../components/CardGrid/CardGrid';
import PrismicImage from '../components/PrismicImage/PrismicImage';

type Props = SeasonWithContent & WithGlobalContextData;
const SeasonPage = ({
  season,
  articles,
  books,
  events,
  exhibitions,
  pages,
  articleSeries,
  projects,
  globalContextData,
}: Props): ReactElement<Props> => {
  const Header = (
    <SeasonsHeader
      labels={{ labels: season.labels }}
      title={season.title}
      FeaturedMedia={
        season.superWidescreenImage && (
          <PrismicImage
            image={{
              url: season.superWidescreenImage.contentUrl,
              dimensions: {
                width: season.superWidescreenImage.width,
                height: season.superWidescreenImage.height || 0,
              },
              alt: season.superWidescreenImage.alt,
              copyright: '',
            }}
          />
        )
      }
      standfirst={season?.standfirst}
      start={season.start}
      end={season.end}
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

  const allItems = [
    ...parsedExhibitions,
    ...parsedEvents,
    ...articles,
    ...books,
    ...pages,
    ...articleSeries,
    ...projects,
  ];

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
      globalContextData={globalContextData}
    >
      <ContentPage
        id={season.id}
        Header={Header}
        Body={<Body body={season.body} pageId={season.id} />}
      />

      {allItems.length > 0 && (
        <SpacingSection>
          <SpacingComponent>
            <CardGrid items={allItems} itemsPerRow={3} />
          </SpacingComponent>
        </SpacingSection>
      )}
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const globalContextData = getGlobalContextData(context);
    const { id, memoizedPrismic } = context.query;
    const seasonWithContent = await getSeasonWithContent({
      request: context.req,
      id: id?.toString() || '',
      memoizedPrismic: memoizedPrismic as unknown as Record<string, unknown>,
    });

    if (seasonWithContent) {
      return {
        props: removeUndefinedProps({
          ...seasonWithContent,
          globalContextData,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

export default SeasonPage;
