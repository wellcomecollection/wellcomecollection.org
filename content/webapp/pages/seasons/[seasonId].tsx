import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { Season } from '@weco/content/types/seasons';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import SeasonsHeader from '@weco/content/components/SeasonsHeader/SeasonsHeader';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { removeUndefinedProps } from '@weco/common/utils/json';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import Body from '@weco/content/components/Body/Body';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { fetchArticles } from '@weco/content/services/prismic/fetch/articles';
import { fetchBooks } from '@weco/content/services/prismic/fetch/books';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { fetchPages } from '@weco/content/services/prismic/fetch/pages';
import { fetchProjects } from '@weco/content/services/prismic/fetch/projects';
import { fetchSeries } from '@weco/content/services/prismic/fetch/series';
import { fetchSeason } from '@weco/content/services/prismic/fetch/seasons';
import { createClient } from '@weco/content/services/prismic/fetch';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '@weco/content/services/prismic/transformers/articles';
import {
  transformBook,
  transformBookToBookBasic,
} from '@weco/content/services/prismic/transformers/books';
import { transformEventBasic } from '@weco/content/services/prismic/transformers/events';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { transformProject } from '@weco/content/services/prismic/transformers/projects';
import { transformSeries } from '@weco/content/services/prismic/transformers/series';
import { transformSeason } from '@weco/content/services/prismic/transformers/seasons';
import { ArticleBasic } from '@weco/content/types/articles';
import { BookBasic } from '@weco/content/types/books';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Page } from '@weco/content/types/pages';
import { Project } from '@weco/content/types/projects';
import { Series } from '@weco/content/types/series';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { getCrop } from '@weco/common/model/image';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';

type Props = {
  season: Season;
  articles: ArticleBasic[];
  books: BookBasic[];
  events: EventBasic[];
  exhibitions: ExhibitionBasic[];
  pages: Page[];
  projects: Project[];
  series: Series[];
  jsonLd: JsonLdObj;
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
  jsonLd,
}: Props): ReactElement<Props> => {
  const superWidescreenImage = getCrop(season.image, '32:15');

  const Header = (
    <SeasonsHeader
      labels={{ labels: season.labels }}
      title={season.title}
      FeaturedMedia={
        superWidescreenImage ? (
          <PrismicImage
            image={superWidescreenImage}
            sizes={{
              xlarge: 1,
              large: 1,
              medium: 1,
              small: 1,
            }}
            quality="low"
          />
        ) : undefined
      }
      standfirst={season?.standfirst}
      start={season.start}
      end={season.end}
    />
  );

  const allItems = [
    ...exhibitions,
    ...events,
    ...articles,
    ...pages,
    ...series,
    ...projects,
    ...books,
  ];

  return (
    <PageLayout
      title={season.title}
      description={season.metadataDescription || season.promo?.caption || ''}
      url={{ pathname: `/seasons/${season.id}` }}
      jsonLd={jsonLd}
      siteSection="whats-on"
      openGraphType="website"
      image={season.image}
      apiToolbarLinks={[createPrismicLink(season.id)]}
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
    const { seasonId } = context.query;
    if (!looksLikePrismicId(seasonId)) {
      return { notFound: true };
    }

    const client = createClient(context);

    // TODO: Is there a reason we're hard-coding predicates here, and not
    // using the Prismic library helpers as on the other pages?
    const booksQueryPromise = fetchBooks(client, {
      predicates: [`[at(my.books.seasons.season, "${seasonId}")]`],
    });
    const articlesQueryPromise = fetchArticles(client, {
      predicates: [`[at(my.articles.seasons.season, "${seasonId}")]`],
    });
    const eventsQueryPromise = fetchEvents(client, {
      predicates: [`[at(my.events.seasons.season, "${seasonId}")]`],
      orderings: ['my.events.times.startDateTime'],
    });
    const exhibitionsQueryPromise = fetchExhibitions(client, {
      predicates: [`[at(my.exhibitions.seasons.season, "${seasonId}")]`],
      order: 'desc',
    });
    const pagesQueryPromise = fetchPages(client, {
      predicates: [`[at(my.pages.seasons.season, "${seasonId}")]`],
    });
    const projectsQueryPromise = fetchProjects(client, {
      predicates: [`[at(my.projects.seasons.season, "${seasonId}")]`],
    });
    const seriesQueryPromise = fetchSeries(client, {
      predicates: [`[at(my.series.seasons.season, "${seasonId}")]`],
    });

    const seasonDocPromise = fetchSeason(client, seasonId);

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

    const articles = transformQuery(articlesQuery, article =>
      transformArticleToArticleBasic(transformArticle(article))
    );
    const books = transformQuery(booksQuery, book =>
      transformBookToBookBasic(transformBook(book))
    );
    const events = transformQuery(eventsQuery, transformEventBasic);
    const exhibitions = transformExhibitionsQuery(exhibitionsQuery);

    const pages = transformQuery(pagesQuery, transformPage);
    const projects = transformQuery(projectsQuery, transformProject);
    const series = transformQuery(seriesQuery, transformSeries);
    const season = seasonDoc && transformSeason(seasonDoc);

    if (season) {
      const jsonLd = contentLd(season);
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
          jsonLd,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

export default SeasonPage;