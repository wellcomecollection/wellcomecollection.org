import * as prismic from '@prismicio/client';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';

import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import PageLayout from '@weco/common/views/components/PageLayout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import Body from '@weco/content/components/Body';
import CardGrid from '@weco/content/components/CardGrid';
import ContentPage from '@weco/content/components/ContentPage';
import SeasonsHeader from '@weco/content/components/SeasonsHeader';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticles } from '@weco/content/services/prismic/fetch/articles';
import { fetchBooks } from '@weco/content/services/prismic/fetch/books';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { fetchPages } from '@weco/content/services/prismic/fetch/pages';
import { fetchProjects } from '@weco/content/services/prismic/fetch/projects';
import { fetchSeason } from '@weco/content/services/prismic/fetch/seasons';
import { fetchSeries } from '@weco/content/services/prismic/fetch/series';
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
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { transformProject } from '@weco/content/services/prismic/transformers/projects';
import { transformSeason } from '@weco/content/services/prismic/transformers/seasons';
import { transformSeries } from '@weco/content/services/prismic/transformers/series';
import { ArticleBasic } from '@weco/content/types/articles';
import { BookBasic } from '@weco/content/types/books';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Page } from '@weco/content/types/pages';
import { Project } from '@weco/content/types/projects';
import { Season } from '@weco/content/types/seasons';
import { Series } from '@weco/content/types/series';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

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
      url={{ pathname: `/seasons/${season.uid}` }}
      jsonLd={jsonLd}
      siteSection="whats-on"
      openGraphType="website"
      image={season.image}
      apiToolbarLinks={[createPrismicLink(season.id)]}
    >
      <ContentPage
        id={season.id}
        Header={<SeasonsHeader season={season} />}
        Body={
          <Body
            untransformedBody={season.untransformedBody}
            pageId={season.id}
          />
        }
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

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { seasonId } = context.query;

  if (!looksLikePrismicId(seasonId)) {
    return { notFound: true };
  }

  const client = createClient(context);

  const seasonDocument = await fetchSeason(client, seasonId);

  if (isNotUndefined(seasonDocument)) {
    const booksQueryPromise = fetchBooks(client, {
      filters: [
        prismic.filter.at('my.books.seasons.season', seasonDocument.id),
      ],
    });
    const articlesQueryPromise = fetchArticles(client, {
      filters: [
        prismic.filter.at('my.articles.seasons.season', seasonDocument.id),
      ],
    });
    const eventsQueryPromise = fetchEvents(client, {
      filters: [
        prismic.filter.at('my.events.seasons.season', seasonDocument.id),
      ],
      orderings: [
        { field: 'my.events.times.startDateTime', direction: 'desc' },
      ],
    });
    const exhibitionsQueryPromise = fetchExhibitions(client, {
      filters: [
        prismic.filter.at('my.exhibitions.seasons.season', seasonDocument.id),
      ],
      order: 'desc',
    });
    const pagesQueryPromise = fetchPages(client, {
      filters: [
        prismic.filter.at('my.pages.seasons.season', seasonDocument.id),
      ],
    });
    const projectsQueryPromise = fetchProjects(client, {
      filters: [
        prismic.filter.at('my.projects.seasons.season', seasonDocument.id),
      ],
    });
    const seriesQueryPromise = fetchSeries(client, {
      filters: [
        prismic.filter.at('my.series.seasons.season', seasonDocument.id),
      ],
    });

    const [
      articlesQuery,
      booksQuery,
      eventsQuery,
      exhibitionsQuery,
      pagesQuery,
      projectsQuery,
      seriesQuery,
    ] = await Promise.all([
      articlesQueryPromise,
      booksQueryPromise,
      eventsQueryPromise,
      exhibitionsQueryPromise,
      pagesQueryPromise,
      projectsQueryPromise,
      seriesQueryPromise,
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
    const season = transformSeason(seasonDocument);

    const serverData = await getServerData(context);
    const jsonLd = contentLd(season);

    return {
      props: serialiseProps({
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
  }

  return { notFound: true };
};

export default SeasonPage;
