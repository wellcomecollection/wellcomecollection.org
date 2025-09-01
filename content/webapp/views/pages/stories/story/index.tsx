import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { SimplifiedServerData } from '@weco/common/server-data/types';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Container } from '@weco/common/views/components/styled/Container';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { ArticleFormatIds } from '@weco/content/data/content-format-ids';
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
import Body from '@weco/content/views/components/Body';
import ContentPage from '@weco/content/views/components/ContentPage';
import FeaturedCard from '@weco/content/views/components/FeaturedCard';
import PartNumberIndicator from '@weco/content/views/components/PartNumberIndicator';

import ContentTypeInfo from './story.ContentTypeInfo';
import { getNextUp, getRelatedDoc, setSeries } from './story.helpers';

const RelatedStoryContainer = styled.div`
  ${props => props.theme.makeSpacePropertyValues('l', ['margin-top'])};
  ${props => props.theme.makeSpacePropertyValues('xl', ['margin-bottom'])};
`;

export type Props = {
  article: Article;
  jsonLd: JsonLdObj;
  serverData: SimplifiedServerData;
};

export type ArticleSeriesList = {
  series: Series;
  articles: ArticleBasic[];
}[];

const ArticlePage: NextPage<Props> = ({ article, serverData, jsonLd }) => {
  const [listOfSeries, setListOfSeries] = useState<ArticleSeriesList>();
  const [relatedDocument, setRelatedDocument] = useState<
    ExhibitionBasic | ContentAPIArticle | undefined
  >();

  useEffect(() => {
    setSeries(article, setListOfSeries);

    if (article.exploreMoreDocument && !relatedDocument) {
      getRelatedDoc(article, setRelatedDocument, serverData);
    }
  }, []);

  const extraBreadcrumbs = [
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
  ];

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
      breadcrumbs={getBreadcrumbItems('stories', extraBreadcrumbs)}
      labels={{ labels: article.labels }}
      title={article.title}
      ContentTypeInfo={ContentTypeInfo(article)}
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
        serverData={serverData}
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
        showStaticLinkedWorks={!isInPicturesFormat}
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
