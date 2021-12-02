import { GetServerSideProps } from 'next';
import { Fragment, FC, useState, useEffect } from 'react';
import { Article } from '@weco/common/model/articles';
import { parseArticleDoc } from '@weco/common/services/prismic/articles';
import { classNames, font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import PartNumberIndicator from '@weco/common/views/components/PartNumberIndicator/PartNumberIndicator';
import PageHeader, {
  getFeaturedMedia,
  getHeroPicture,
} from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { articleLd } from '@weco/common/utils/json-ld';
import { ArticleFormatIds } from '@weco/common/model/content-format-id';
import Space from '@weco/common/views/components/styled/Space';
import { AppErrorProps, WithGaDimensions } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { isString } from '@weco/common/utils/array';
import PageHeaderStandfirst from '../components/PageHeaderStandfirst/PageHeaderStandfirst';
import SeriesNavigation from '../components/SeriesNavigation/SeriesNavigation';
import Body from '../components/Body/Body';
import ContentPage from '../components/ContentPage/ContentPage';
import { createClient } from '../services/prismic/fetch';
import {
  fetchArticle,
  fetchArticlesClientSide,
} from '../services/prismic/fetch/articles';

type Props = {
  article: Article;
} & WithGaDimensions;

function articleHasOutro(article: Article) {
  return Boolean(
    article.outroResearchItem || article.outroReadItem || article.outroVisitItem
  );
}

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const { id } = context.query;
    if (!isString(id)) {
      return { notFound: true };
    }

    const client = createClient(context);
    const articleDocument = await fetchArticle(client, id);
    const serverData = await getServerData(context);
    const article = parseArticleDoc(articleDocument);

    if (article) {
      return {
        props: removeUndefinedProps({
          article,
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

const ArticlePage: FC<Props> = ({ article }) => {
  const [listOfSeries, setListOfSeries] = useState<any[]>();

  useEffect(() => {
    async function setSeries() {
      const series = article.series[0];
      if (series) {
        const seriesField =
          series.id === 'WleP3iQAACUAYEoN' || series.id === 'X8D9qxIAACIAcKSf'
            ? 'my.webcomics.series.series'
            : 'my.articles.series.series';

        const articlesInSeries =
          series &&
          (await fetchArticlesClientSide({
            predicates: [`[at(${seriesField}, "${series.id}")]`],
          }));

        const articles = articlesInSeries?.results.map(parseArticleDoc);

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
    article.format && article.format.id === ArticleFormatIds.Podcast;

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

  const genericFields = {
    id: article.id,
    title: article.title,
    contributors: article.contributors,
    contributorsTitle: article.contributorsTitle,
    promo: article.promo,
    body: article.body,
    standfirst: article.standfirst,
    promoImage: article.promoImage,
    promoText: article.promoText,
    image: article.image,
    squareImage: article.squareImage,
    widescreenImage: article.widescreenImage,
    superWidescreenImage: article.superWidescreenImage,
    labels: article.labels,
    metadataDescription: article.metadataDescription,
  };

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
            {article.contributors.map(({ contributor, role }, i, arr) => (
              <Fragment key={contributor.id}>
                {role && role.describedBy && (
                  <span>
                    {i === 0 ? capitalize(role.describedBy) : role.describedBy}{' '}
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
  const maybeHeroPicture = getHeroPicture(genericFields);
  const maybeFeaturedMedia = !maybeHeroPicture
    ? getFeaturedMedia(genericFields)
    : null;
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
      Background={null}
      FeaturedMedia={isImageGallery || isPodcast ? null : maybeFeaturedMedia}
      HeroPicture={isImageGallery || isPodcast ? null : maybeHeroPicture}
      heroImageBgColor={isImageGallery ? 'white' : 'cream'}
      TitleTopper={TitleTopper}
      isContentTypeInfoBeforeMedia={true}
    />
  );

  const Siblings =
    listOfSeries &&
    listOfSeries
      .map(({ series, articles }) => {
        if (series.schedule.length > 0 && positionInSerial) {
          const nextUp =
            positionInSerial === series.schedule.length
              ? series.items[0]
              : series.items[positionInSerial]
              ? series.items[positionInSerial]
              : null;

          return nextUp ? (
            <SeriesNavigation
              key={series.id}
              series={series}
              items={[nextUp]}
            />
          ) : null;
        } else {
          // Overkill? Should this happen on the API?
          const dedupedArticles = articles
            .filter(a => a.id !== article.id)
            .slice(0, 2);
          return (
            <SeriesNavigation
              key={series.id}
              series={series}
              items={dedupedArticles}
            />
          );
        }
      })
      .filter(Boolean);

  return (
    <PageLayout
      title={article.title}
      description={article.metadataDescription || article.promoText || ''}
      url={{ pathname: `/articles/${article.id}` }}
      jsonLd={articleLd(article)}
      openGraphType={'article'}
      siteSection={'stories'}
      imageUrl={article.image && convertImageUri(article.image.contentUrl, 800)}
      imageAltText={(article.image && article.image.alt) ?? undefined}
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
        contributorProps={{ contributors: article.contributors }}
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
