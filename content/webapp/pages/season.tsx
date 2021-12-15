import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { SeasonWithContent } from '@weco/common/model/seasons';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import SeasonsHeader from '@weco/content/components/SeasonsHeader/SeasonsHeader';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getSeasonWithContent } from '@weco/common/services/prismic/seasons';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { convertJsonToDates } from './event';
import { getServerData } from '@weco/common/server-data';
import CardGrid from '../components/CardGrid/CardGrid';
import Body from '../components/Body/Body';
import ContentPage from '../components/ContentPage/ContentPage';
import { contentLd } from '../services/prismic/transformers/json-ld';
import { fetchArticles } from '../services/prismic/fetch/articles';
import { fetchBooks } from '../services/prismic/fetch/books';
import { isString } from '@weco/common/utils/array';
import { createClient } from '../services/prismic/fetch';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import { transformArticle } from '../services/prismic/transformers/articles';
import { transformBook } from '../services/prismic/transformers/books';
import { Article } from '../types/articles';
import { Book } from '../types/books';

type Props = SeasonWithContent & {
  articles: Article[];
  books: Book[];
};
const SeasonPage = ({
  season,
  articles,
  events,
  exhibitions,
  pages,
  articleSeries,
  projects,
  books,
}: Props): ReactElement<Props> => {
  const Header = (
    <SeasonsHeader
      labels={{ labels: season.labels }}
      title={season.title}
      FeaturedMedia={
        <UiImage {...season.superWidescreenImage} sizesQueries="" />
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
    ...pages,
    ...articleSeries,
    ...projects,
    ...books,
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
    >
      <ContentPage
        id={season.id}
        Header={Header}
        Body={<Body body={season.body} pageId={season.id} />}
        document={season.prismicDocument}
        hideContributors={true}
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
    const { id } = context.query;
    if (!isString(id)) {
      return { notFound: true };
    }

    const client = createClient(context);
    const booksQueryPromise = fetchBooks(client, {
      predicates: [`[at(my.books.seasons.season, "${id}")]`],
    });
    const articlesQueryPromise = fetchArticles(client, {
      predicates: [`[at(my.articles.seasons.season, "${id}")]`],
    });

    const { memoizedPrismic } = context.query;
    const seasonWithContentPromise = getSeasonWithContent({
      request: context.req,
      id: id?.toString() || '',
      memoizedPrismic: memoizedPrismic as unknown as Record<string, unknown>,
    });

    const [articlesQuery, booksQuery, seasonWithContent] = await Promise.all([
      articlesQueryPromise,
      booksQueryPromise,
      seasonWithContentPromise,
    ]);

    const articles = transformQuery(articlesQuery, transformArticle);
    const books = transformQuery(booksQuery, transformBook);

    if (seasonWithContent) {
      const serverData = await getServerData(context);
      return {
        props: removeUndefinedProps({
          ...seasonWithContent,
          articles: articles.results,
          books: books.results,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

export default SeasonPage;
