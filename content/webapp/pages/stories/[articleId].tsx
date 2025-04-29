import { GetServerSideProps } from 'next';
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';

import { bodySquabblesSeries } from '@weco/common/data/hardcoded-ids';
import { ExhibitionsDocument as RawExhibitionsDocument } from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { Pageview } from '@weco/common/services/conversion/track';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { font } from '@weco/common/utils/classnames';
import { isPast } from '@weco/common/utils/dates';
import { capitalize } from '@weco/common/utils/grammar';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import Standfirst from '@weco/common/views/slices/Standfirst';
import Body from '@weco/content/components/Body';
import ContentPage from '@weco/content/components/ContentPage';
import FeaturedCard from '@weco/content/components/FeaturedCard';
import PartNumberIndicator from '@weco/content/components/PartNumberIndicator';
import SeriesNavigation from '@weco/content/components/SeriesNavigation';
import { ArticleFormatIds } from '@weco/content/data/content-format-ids';
import {
  createClient,
  fetchFromClientSide,
} from '@weco/content/services/prismic/fetch';
import {
  fetchArticle,
  fetchArticlesClientSide,
} from '@weco/content/services/prismic/fetch/articles';
import { transformArticle } from '@weco/content/services/prismic/transformers/articles';
import {
  transformExhibition,
  transformExhibitionToExhibitionBasic,
} from '@weco/content/services/prismic/transformers/exhibitions';
import { articleLd } from '@weco/content/services/prismic/transformers/json-ld';
import { getArticle } from '@weco/content/services/wellcome/content/article';
import { Article as ContentAPIArticle } from '@weco/content/services/wellcome/content/types/api';
import {
  Article,
  ArticleBasic,
  getPartNumberInSeries,
} from '@weco/content/types/articles';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Series } from '@weco/content/types/series';
import {
  getFeaturedMedia,
  getHeroPicture,
} from '@weco/content/utils/page-header';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

const ContentTypeWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const ContentTypeText = styled.p.attrs({
  className: font('intr', 6),
})`
  margin: 0;
`;

const RelatedStoryContainer = styled.div`
  ${props => props.theme.makeSpacePropertyValues('l', ['margin-top'])};
  ${props => props.theme.makeSpacePropertyValues('xl', ['margin-bottom'])};
`;

type Props = {
  article: Article;
  jsonLd: JsonLdObj;
  serverData: SimplifiedServerData;
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

const ArticlePage: FunctionComponent<Props> = ({
  article,
  serverData,
  jsonLd,
}) => {
  const [listOfSeries, setListOfSeries] = useState<ArticleSeriesList>();
  const [relatedDocument, setRelatedDocument] = useState<
    ExhibitionBasic | ContentAPIArticle | undefined
  >();

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

    async function getRelatedDoc() {
      if (article.exploreMoreDocument?.type === 'exhibitions') {
        const relatedExhibition =
          await fetchFromClientSide<RawExhibitionsDocument>({
            endpoint: 'exhibitions/exhibition',
            params: {
              id:
                article.exploreMoreDocument?.uid ||
                article.exploreMoreDocument?.id,
            },
          });

        if (relatedExhibition) {
          // We're hiding exhibitions once they've ended, so not setting the related document value.
          const isPastExhibition = isPast(
            transformTimestamp(relatedExhibition.data.end) || new Date()
          );

          if (!isPastExhibition) {
            const transformedRelatedExhibition =
              transformExhibitionToExhibitionBasic(
                transformExhibition(relatedExhibition)
              );
            setRelatedDocument(transformedRelatedExhibition);
          }
        }
      }

      if (article.exploreMoreDocument?.type === 'articles') {
        const relatedArticle = await getArticle({
          id: article.exploreMoreDocument.id,
          toggles: serverData.toggles,
        });

        if (relatedArticle?.type === 'Article') {
          setRelatedDocument(relatedArticle);
        }
      }
    }

    setSeries();

    if (article.exploreMoreDocument && !relatedDocument) {
      getRelatedDoc();
    }
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
      ...article.series.slice(0, 1).map(series => {
        return {
          url: linkResolver(series),
          text: series.title || '',
          prefix: 'Part of',
        };
      }),
      {
        url: linkResolver(article),
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
      url={{ pathname: `/stories/${article.uid}` }}
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

      {article.exploreMoreDocument && relatedDocument && (
        <>
          <WobblyEdge isRotated backgroundColor="warmNeutral.300" />
          <Container>
            <RelatedStoryContainer>
              {relatedDocument.type === 'Article' ? (
                <>
                  <h2 className={font('wb', 2)}>Your next story</h2>
                  <FeaturedCard
                    type="article"
                    background="neutral.700"
                    textColor="white"
                    article={relatedDocument}
                  />
                </>
              ) : (
                relatedDocument.type === 'exhibitions' && (
                  <>
                    <h2 className={font('wb', 2)}>
                      You may also be interested in
                    </h2>
                    <FeaturedCard
                      type="exhibition"
                      background="neutral.700"
                      textColor="white"
                      exhibition={relatedDocument}
                    />
                  </>
                )
              )}
            </RelatedStoryContainer>
          </Container>
        </>
      )}
    </PageLayout>
  );
};

export default ArticlePage;
