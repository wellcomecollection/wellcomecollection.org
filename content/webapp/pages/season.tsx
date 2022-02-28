import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { Season } from '@weco/common/model/seasons';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import SeasonsHeader from '@weco/content/components/SeasonsHeader/SeasonsHeader';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { removeUndefinedProps } from '@weco/common/utils/json';
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
import { fetchEvents } from '../services/prismic/fetch/events';
import { fetchExhibitions } from '../services/prismic/fetch/exhibitions';
import { fetchPages } from '../services/prismic/fetch/pages';
import { fetchProjects } from '../services/prismic/fetch/projects';
import { fetchSeries } from '../services/prismic/fetch/series';
import { fetchSeason } from '../services/prismic/fetch/seasons';
import { createClient } from '../services/prismic/fetch';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import { transformArticle } from '../services/prismic/transformers/articles';
import { transformBook } from '../services/prismic/transformers/books';
import { transformEvent } from '../services/prismic/transformers/events';
import { transformExhibitionsQuery } from '../services/prismic/transformers/exhibitions';
import { transformPage } from '../services/prismic/transformers/pages';
import { transformProject } from '../services/prismic/transformers/projects';
import { transformSeries } from '../services/prismic/transformers/series';
import { transformSeason } from '../services/prismic/transformers/seasons';
import { Article } from '../types/articles';
import { Book } from '../types/books';
import { Event } from '../types/events';
import { Exhibition } from '../types/exhibitions';
import { Page } from '../types/pages';
import { Project } from '../types/projects';
import { Series } from '../types/series';
import { looksLikePrismicId } from '../services/prismic';

type Props = {
  season: Season;
  articles: Article[];
  books: Book[];
  events: Event[];
  exhibitions: Exhibition[];
  pages: Page[];
  projects: Project[];
  series: Series[];
};

const SeasonPage = ({
  season,
  articles,
  events,
  exhibitions,
  pages,
  series,
  projects,
  books,
}: Props): ReactElement<Props> => {
  const Header = (
    <SeasonsHeader
      labels={{ labels: season.labels }}
      title={season.title}
      FeaturedMedia={
        season.superWidescreenImage ? (
          <UiImage {...season.superWidescreenImage} sizesQueries="" />
        ) : undefined
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
    ...series,
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
      image={season.image}
    >
      <ContentPage
        id={season.id}
        Header={Header}
        Body={<Body body={season.body} pageId={season.id} />}
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
    if (!looksLikePrismicId(id)) {
      return { notFound: true };
    }

    const client = createClient(context);
    const booksQueryPromise = fetchBooks(client, {
      predicates: [`[at(my.books.seasons.season, "${id}")]`],
    });
    const articlesQueryPromise = fetchArticles(client, {
      predicates: [`[at(my.articles.seasons.season, "${id}")]`],
    });
    const eventsQueryPromise = fetchEvents(client, {
      predicates: [`[at(my.events.seasons.season, "${id}")]`],
      orderings: ['my.events.times.startDateTime'],
    });
    const exhibitionsQueryPromise = fetchExhibitions(client, {
      predicates: [`[at(my.exhibitions.seasons.season, "${id}")]`],
      order: 'desc',
    });
    const pagesQueryPromise = fetchPages(client, {
      predicates: [`[at(my.pages.seasons.season, "${id}")]`],
    });
    const projectsQueryPromise = fetchProjects(client, {
      predicates: [`[at(my.projects.seasons.season, "${id}")]`],
    });
    const seriesQueryPromise = fetchSeries(client, {
      predicates: [`[at(my.series.seasons.season, "${id}")]`],
    });

    const seasonDocPromise = fetchSeason(client, id as string);

    const [
      articlesQuery,
      booksQuery,
      eventsQuery,
      exhibitionsQuery,
      pagesQuery,
      projectsQuery,
      seriesQuery,
      seasonDoc,
    ] = await Promise.all([
      articlesQueryPromise,
      booksQueryPromise,
      eventsQueryPromise,
      exhibitionsQueryPromise,
      pagesQueryPromise,
      projectsQueryPromise,
      seriesQueryPromise,
      seasonDocPromise,
    ]);

    const articles = transformQuery(articlesQuery, transformArticle);
    const books = transformQuery(booksQuery, transformBook);
    const events = transformQuery(eventsQuery, transformEvent);
    const exhibitions = transformExhibitionsQuery(exhibitionsQuery);
    const pages = transformQuery(pagesQuery, transformPage);
    const projects = transformQuery(projectsQuery, transformProject);
    const series = transformQuery(seriesQuery, transformSeries);
    const season = seasonDoc && transformSeason(seasonDoc);

    if (season) {
      const serverData = await getServerData(context);
      return {
        props: removeUndefinedProps({
          season,
          articles: articles.results,
          books: books.results,
          events: events.results,
          exhibitions: exhibitions.results,
          pages: pages.results,
          projects: projects.results,
          series: series.results,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

export default SeasonPage;
