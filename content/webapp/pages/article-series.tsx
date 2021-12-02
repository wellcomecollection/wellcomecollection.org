import { GetServerSideProps } from 'next';
import { FC } from 'react';
import { getArticleSeries } from '@weco/common/services/prismic/article-series';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeaderStandfirst from '../components/PageHeaderStandfirst/PageHeaderStandfirst';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader, {
  getFeaturedMedia,
} from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import type { ArticleSeries } from '@weco/common/model/article-series';
import type { Article } from '@weco/common/model/articles';
import { seasonsFields } from '@weco/common/services/prismic/fetch-links';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { AppErrorProps, WithGaDimensions } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import Body from '../components/Body/Body';
import SearchResults from '../components/SearchResults/SearchResults';
import ContentPage from '../components/ContentPage/ContentPage';

type Props = {
  series: ArticleSeries;
  articles: Article[];
} & WithGaDimensions;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id, memoizedPrismic } = context.query;
    const seriesAndArticles = await getArticleSeries(
      context.req,
      {
        id,
        pageSize: 100,
        fetchLinks: seasonsFields,
      },
      memoizedPrismic
    );

    if (seriesAndArticles) {
      const { series, articles } = seriesAndArticles;
      return {
        props: removeUndefinedProps({
          series,
          articles,
          serverData,
          gaDimensions: {
            partOf: series.seasons.map<string>(season => season.id),
          },
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const ArticleSeriesPage: FC<Props> = props => {
  const { series, articles } = props;
  const breadcrumbs = {
    items: [
      {
        url: '/stories',
        text: 'Stories',
      },
      {
        url: `/series/${series.id}`,
        text: series.title,
        isHidden: true,
      },
    ],
  };

  const genericFields = {
    id: series.id,
    title: series.title,
    contributors: series.contributors,
    contributorsTitle: series.contributorsTitle,
    promo: series.promo,
    body: series.body,
    standfirst: series.standfirst,
    promoImage: series.promoImage,
    promoText: series.promoText,
    image: series.image,
    squareImage: series.squareImage,
    widescreenImage: series.widescreenImage,
    superWidescreenImage: series.superWidescreenImage,
    labels: series.labels,
    metadataDescription: series.metadataDescription,
  };

  const ContentTypeInfo = series.standfirst && (
    <PageHeaderStandfirst html={series.standfirst} />
  );
  const FeaturedMedia = getFeaturedMedia(genericFields);
  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: series.labels }}
      title={series.title}
      ContentTypeInfo={ContentTypeInfo}
      Background={
        <HeaderBackground
          hasWobblyEdge={true}
          backgroundTexture={headerBackgroundLs}
        />
      }
      FeaturedMedia={FeaturedMedia}
      HeroPicture={null}
      isContentTypeInfoBeforeMedia={true}
    />
  );

  return (
    <PageLayout
      title={series.title}
      description={series.metadataDescription || series.promoText || ''}
      url={{ pathname: `/series/${series.id}` }}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection={'stories'}
      openGraphType={'website'}
      imageUrl={series.image && convertImageUri(series.image.contentUrl, 800)}
      imageAltText={(series.image && series.image.alt) ?? undefined}
    >
      <ContentPage
        id={series.id}
        Header={Header}
        Body={<Body body={series.body} pageId={series.id} />}
        document={series.prismicDocument}
        seasons={series.seasons}
      >
        {articles.length > 0 && (
          <SearchResults items={series.items} showPosition={true} />
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default ArticleSeriesPage;
