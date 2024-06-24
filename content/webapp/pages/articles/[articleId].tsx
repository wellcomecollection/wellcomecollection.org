import { GetServerSideProps } from 'next';
import { FunctionComponent, useState, useEffect, ReactElement } from 'react';
import {
  Article,
  ArticleBasic,
  getPartNumberInSeries,
} from '@weco/content/types/articles';
import { Series } from '@weco/content/types/series';
import { font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import PartNumberIndicator from '@weco/content/components/PartNumberIndicator/PartNumberIndicator';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import {
  getFeaturedMedia,
  getHeroPicture,
} from '@weco/content/utils/page-header';
import { ArticleFormatIds } from '@weco/content/data/content-format-ids';
import Space from '@weco/common/views/components/styled/Space';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import SeriesNavigation from '@weco/content/components/SeriesNavigation/SeriesNavigation';
import Body from '@weco/content/components/Body/Body';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import { createClient } from '@weco/content/services/prismic/fetch';
import {
  fetchArticle,
  fetchArticlesClientSide,
} from '@weco/content/services/prismic/fetch/articles';
import { articleLd } from '@weco/content/services/prismic/transformers/json-ld';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { bodySquabblesSeries } from '@weco/common/data/hardcoded-ids';
import { transformArticle } from '@weco/content/services/prismic/transformers/articles';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import styled from 'styled-components';
import { Pageview } from '@weco/common/services/conversion/track';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import Standfirst from '@weco/common/views/slices/Standfirst';

const ContentTypeWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const ContentTypeText = styled.p.attrs({
  className: font('intr', 6),
})`
  margin: 0;
`;

type Props = {
  article: Article;
  jsonLd: JsonLdObj;
  gaDimensions: GaDimensions;
  pageview: Pageview;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { articleId } = context.query;

  if (!looksLikePrismicId(articleId)) {
    return { notFound: true };
  }

  const client = createClient(context);
  const articleDocument = await fetchArticle(client, articleId);

  if (isNotUndefined(articleDocument)) {
    const serverData = await getServerData(context);
    const article = transformArticle(articleDocument);
    const jsonLd = articleLd(article);
    return {
      props: serialiseProps({
        article,
        jsonLd,
        serverData,
        gaDimensions: {
          partOf: article.seasons
            .map(season => season.id)
            .concat(article.series.map(series => series.id)),
        },
        pageview: {
          name: 'story',
          properties: { type: articleDocument.type },
        },
      }),
    };
  }

  return { notFound: true };
};

type ArticleSeriesList = {
  series: Series;
  articles: ArticleBasic[];
}[];

function getNextUp(
  series: Series,
  articles: ArticleBasic[],
  article: Article,
  currentPosition: number | undefined,
  isPodcast: boolean
): ReactElement | null {
  if (series.schedule.length > 0 && currentPosition) {
    const firstArticleFromSchedule = series.schedule.find(
      i => i.partNumber === 1
    );
    const firstArticleTitle = firstArticleFromSchedule?.title;
    const firstArticle = articles.find(i => i.title === firstArticleTitle);

    const nextArticleFromSchedule = series.schedule.find(
      i => i.partNumber === currentPosition + 1
    );
    const nextArticleTitle = nextArticleFromSchedule?.title;
    const nextArticle = articles.find(i => i.title === nextArticleTitle);

    const nextUp =
      currentPosition === series.schedule.length && series.schedule.length > 1
        ? firstArticle
        : nextArticle || null;

    return nextUp ? (
      <SeriesNavigation
        series={series}
        items={[nextUp]}
        isPodcast={isPodcast}
      />
    ) : null;
  } else {
    const dedupedArticles = articles
      .filter(a => a.id !== article.id)
      .slice(0, 2);
    return (
      <SeriesNavigation
        series={series}
        items={dedupedArticles}
        isPodcast={isPodcast}
      />
    );
  }
}

const ContentTypeInfoSection = styled.span`
  &:not(:first-child)::before {
    content: ' | ';
    margin: 0 4px;
  }
`;

const HTMLDateWrapper = styled.span.attrs({ className: font('intr', 6) })`
  display: block;
  color: ${props => props.theme.color('neutral.600')};
`;

const ArticlePage: FunctionComponent<Props> = ({ article, jsonLd }) => {
  const [listOfSeries, setListOfSeries] = useState<ArticleSeriesList>();

  useEffect(() => {
    async function setSeries() {
      const series = article.series[0];
      if (series) {
        const seriesField =
          series.id === bodySquabblesSeries
            ? 'my.webcomics.series.series'
            : 'my.articles.series.series';

        // Note: we deliberately use a hard-coded string here instead of the
        // filter DSL in the Prismic client library, because it means we don't
        // send the Prismic client library as part of the browser bundle.
        const filters = [`[at(${seriesField}, "${series.id}")]`];

        const articlesInSeries = series
          ? await fetchArticlesClientSide({ filters })
          : undefined;

        const articles = articlesInSeries?.results ?? [];

        if (series) {
          setListOfSeries([{ series, articles }]);
        }
      }
    }

    setSeries();
  }, []);

  const breadcrumbs = {
    items: [
      {
        url: '/stories',
        text: 'Stories',
      },
      // GOTCHA: we only take the first of the series list as the data is being
      // used a little bit badly, but we don't have capacity to implement a
      // better solution
      ...article.series.slice(0, 1).map(series => ({
        url: `/series/${series.id}`,
        text: series.title || '',
        prefix: 'Part of',
      })),
      {
        url: `/articles/${article.id}`,
        text: article.title,
        isHidden: true,
      },
    ],
  };

  const isPodcast = article.format?.id === ArticleFormatIds.Podcast;

  // Check if the article is in a serial, and where
  // If so, create relevant PartNumberIndicator
  const serial = article.series.find(series => series.schedule.length > 0);
  const partNumber = getPartNumberInSeries(article);

  const SerialPartNumber = serial && partNumber && (
    <PartNumberIndicator
      number={partNumber}
      backgroundColor={serial.color}
      description={isPodcast ? 'Episode' : 'Part'}
    />
  );

  const ContentTypeInfo = (
    <>
      {article.untransformedStandfirst && (
        <Standfirst
          slice={article.untransformedStandfirst}
          index={0}
          context={{}}
          slices={[]}
        />
      )}
      <ContentTypeWrapper>
        <Space $v={{ size: 's', properties: ['margin-top'] }}>
          <ContentTypeText>
            {article.contributors.length > 0 &&
              article.contributors.map(({ contributor, role }, i) => (
                <ContentTypeInfoSection
                  data-testid="contributor-name"
                  key={contributor.id}
                >
                  {role && role.describedBy && (
                    <span>
                      {i === 0
                        ? capitalize(role.describedBy)
                        : role.describedBy}{' '}
                      by{' '}
                    </span>
                  )}
                  <span className={font('intb', 6)}>{contributor.name}</span>
                </ContentTypeInfoSection>
              ))}
            {article.readingTime ? (
              <ContentTypeInfoSection>
                average reading time{' '}
                <span className={font('intb', 6)}>{article.readingTime}</span>
              </ContentTypeInfoSection>
            ) : null}
            {article.contributors.length > 0 && ' '}

            <HTMLDateWrapper>
              <HTMLDate date={article.datePublished} />
            </HTMLDateWrapper>
          </ContentTypeText>
        </Space>
      </ContentTypeWrapper>
    </>
  );

  // This is for content that we don't have the crops for in Prismic
  const maybeHeroPicture = getHeroPicture(article);
  const maybeFeaturedMedia = !maybeHeroPicture
    ? getFeaturedMedia(article)
    : undefined;
  const isComicFormat = article.format?.id === ArticleFormatIds.Comic;
  const isInPicturesFormat = article.format?.id === ArticleFormatIds.InPictures;
  const isShortFilmFormat = article.format?.id === ArticleFormatIds.ShortFilm;
  const isStandaloneImageGallery = isInPicturesFormat || isComicFormat;

  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: article.labels }}
      title={article.title}
      ContentTypeInfo={ContentTypeInfo}
      FeaturedMedia={
        isShortFilmFormat || isStandaloneImageGallery || isPodcast
          ? undefined
          : maybeFeaturedMedia
      }
      HeroPicture={
        isShortFilmFormat || isStandaloneImageGallery || isPodcast
          ? undefined
          : maybeHeroPicture
      }
      heroImageBgColor={isStandaloneImageGallery ? 'white' : 'warmNeutral.300'}
      SerialPartNumber={SerialPartNumber}
      isContentTypeInfoBeforeMedia={true}
    />
  );

  const Siblings = listOfSeries
    ?.map(({ series, articles }) => {
      return getNextUp(series, articles, article, partNumber, isPodcast);
    })
    .filter(Boolean);

  function getComicPreviousNext() {
    return listOfSeries?.map(({ articles }) => {
      const positionInSeries = articles.findIndex(a => a.id === article.id);
      const previous = articles[positionInSeries + 1];
      const next = articles[positionInSeries - 1];

      return { previous, next };
    })[0];
  }

  return (
    <PageLayout
      title={article.title}
      description={article.metadataDescription || article.promo?.caption || ''}
      url={{ pathname: `/articles/${article.id}` }}
      jsonLd={jsonLd}
      openGraphType="article"
      siteSection="stories"
      image={article.image}
      apiToolbarLinks={[createPrismicLink(article.id)]}
    >
      <ContentPage
        id={article.id}
        isCreamy={!isPodcast}
        Header={Header}
        Body={
          <Body
            untransformedBody={article.untransformedBody}
            comicPreviousNext={
              isComicFormat ? getComicPreviousNext() : undefined
            }
            isDropCapped={true}
            pageId={article.id}
            minWidth={isPodcast ? 10 : 8}
            contentType={
              isShortFilmFormat
                ? 'short-film'
                : isStandaloneImageGallery
                ? 'standalone-image-gallery'
                : undefined
            }
          />
        }
        RelatedContent={Siblings}
        contributors={article.contributors}
        seasons={article.seasons}
      />
    </PageLayout>
  );
};

export default ArticlePage;
