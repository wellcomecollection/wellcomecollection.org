import { GetServerSideProps } from 'next';
import { Fragment, FC, useState, useEffect, ReactElement } from 'react';
import { Article } from '../types/articles';
import { Series } from '../types/series';
import { classNames, font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import PartNumberIndicator from '../components/PartNumberIndicator/PartNumberIndicator';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { getFeaturedMedia, getHeroPicture } from '../utils/page-header';
import { ArticleFormatIds } from '@weco/common/services/prismic/content-format-ids';
import Space from '@weco/common/views/components/styled/Space';
import { AppErrorProps, WithGaDimensions } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import PageHeaderStandfirst from '../components/PageHeaderStandfirst/PageHeaderStandfirst';
import SeriesNavigation from '../components/SeriesNavigation/SeriesNavigation';
import Body from '../components/Body/Body';
import ContentPage from '../components/ContentPage/ContentPage';
import { createClient } from '../services/prismic/fetch';
import {
  fetchArticle,
  fetchArticlesClientSide,
} from '../services/prismic/fetch/articles';
import { articleLd } from '../services/prismic/transformers/json-ld';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { bodySquabblesSeries } from '@weco/common/services/prismic/hardcoded-id';
import { transformArticle } from '../services/prismic/transformers/articles';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';

type Props = {
  article: Article;
  jsonLd: JsonLdObj;
} & WithGaDimensions;

function articleHasOutro(article: Article) {
  return Boolean(
    article.outroResearchItem || article.outroReadItem || article.outroVisitItem
  );
}

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const { id } = context.query;
    if (!looksLikePrismicId(id)) {
      return { notFound: true };
    }

    const client = createClient(context);
    const articleDocument = await fetchArticle(client, id as string);
    const serverData = await getServerData(context);

    if (articleDocument) {
      const article = transformArticle(articleDocument);
      const jsonLd = articleLd(article);
      return {
        props: removeUndefinedProps({
          article,
          jsonLd,
          serverData,
          gaDimensions: {
            partOf: article.seasons
              .map(season => season.id)
              .concat(article.series.map(series => series.id)),
          },
        }),
      };
    } else {
      return { notFound: true };
    }
  };

type ArticleSeriesList = {
  series: Series;
  articles: Article[];
}[];

function getNextUp(
  series: Series,
  articles: Article[],
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
        key={series.id}
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

const ArticlePage: FC<Props> = ({ article, jsonLd }) => {
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
        // predicate DSL in the Prismic client library, because it means we don't
        // send the Prismic client library as part of the browser bundle.
        const predicates = [`[at(${seriesField}, "${series.id}")]`];

        const articlesInSeries = series
          ? await fetchArticlesClientSide({ predicates })
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
        prefix: `Part of`,
      })),
      {
        url: `/articles/${article.id}`,
        text: article.title,
        isHidden: true,
      },
    ],
  };

  const isPodcast =
    (article.format && article.format.id === ArticleFormatIds.Podcast) || false;

  // Check if the article is in a serial, and where
  const serial = article.series.find(series => series.schedule.length > 0);
  const titlesInSerial = serial && serial.schedule.map(item => item.title);
  const positionInSerial =
    titlesInSerial && titlesInSerial.indexOf(article.title) + 1;

  // We can abstract this out as a component if we see it elsewhere.
  // Not too confident it's going to be used like this for long.
  const TitleTopper = serial && positionInSerial && (
    <PartNumberIndicator
      number={positionInSerial}
      color={serial.color}
      description={isPodcast ? 'Episode' : 'Part'}
    />
  );

  const ContentTypeInfo = (
    <Fragment>
      {article.standfirst && <PageHeaderStandfirst html={article.standfirst} />}
      <div
        className={classNames({
          flex: true,
          'flex--h-baseline': true,
        })}
      >
        <Space v={{ size: 's', properties: ['margin-top'] }}>
          <p
            className={classNames({
              'no-margin': true,
              [font('hnr', 6)]: true,
            })}
          >
            {article.contributors.length > 0 &&
              article.contributors.map(({ contributor, role }, i, arr) => (
                <Fragment key={contributor.id}>
                  {role && role.describedBy && (
                    <span>
                      {i === 0
                        ? capitalize(role.describedBy)
                        : role.describedBy}{' '}
                      by{' '}
                    </span>
                  )}
                  <span
                    className={classNames({
                      [font('hnb', 6)]: true,
                    })}
                  >
                    {contributor.name}
                  </span>
                  <Space
                    as="span"
                    h={{
                      size: 's',
                      properties: ['margin-left', 'margin-right'],
                    }}
                  >
                    {arr.length > 1 && i < arr.length - 1 && '|'}
                  </Space>
                </Fragment>
              ))}

            {article.contributors.length > 0 && ' '}

            <span
              className={classNames({
                'block font-pewter': true,
                [font('hnr', 6)]: true,
              })}
            >
              <HTMLDate date={new Date(article.datePublished)} />
            </span>
          </p>
        </Space>
      </div>
    </Fragment>
  );

  // This is for content that we don't have the crops for in Prismic
  const maybeHeroPicture = getHeroPicture(article);
  const maybeFeaturedMedia = !maybeHeroPicture
    ? getFeaturedMedia(article)
    : undefined;
  const isImageGallery =
    article.format &&
    (article.format.id === ArticleFormatIds.ImageGallery ||
      article.format.id === ArticleFormatIds.Comic);

  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: article.labels }}
      title={article.title}
      ContentTypeInfo={ContentTypeInfo}
      Background={undefined}
      FeaturedMedia={
        isImageGallery || isPodcast ? undefined : maybeFeaturedMedia
      }
      HeroPicture={isImageGallery || isPodcast ? undefined : maybeHeroPicture}
      heroImageBgColor={isImageGallery ? 'white' : 'cream'}
      TitleTopper={TitleTopper}
      isContentTypeInfoBeforeMedia={true}
    />
  );

  const Siblings = listOfSeries
    ?.map(({ series, articles }) => {
      return getNextUp(series, articles, article, positionInSerial, isPodcast);
    })
    .filter(Boolean);

  return (
    <PageLayout
      title={article.title}
      description={article.metadataDescription || article.promo?.caption || ''}
      url={{ pathname: `/articles/${article.id}` }}
      jsonLd={jsonLd}
      openGraphType={'article'}
      siteSection={'stories'}
      image={article.image}
    >
      <ContentPage
        id={article.id}
        isCreamy={!isPodcast}
        Header={Header}
        Body={
          <Body
            body={article.body}
            isDropCapped={true}
            pageId={article.id}
            minWidth={isPodcast ? 10 : 8}
          />
        }
        RelatedContent={Siblings}
        contributors={article.contributors}
        outroProps={
          articleHasOutro(article)
            ? {
                researchLinkText: article.outroResearchLinkText,
                researchItem: article.outroResearchItem,
                readLinkText: article.outroReadLinkText,
                readItem: article.outroReadItem,
                visitLinkText: article.outroVisitLinkText,
                visitItem: article.outroVisitItem,
              }
            : undefined
        }
        seasons={article.seasons}
      />
    </PageLayout>
  );
};

export default ArticlePage;
