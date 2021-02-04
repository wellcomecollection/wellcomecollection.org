// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { getArticleSeries } from '@weco/common/services/prismic/article-series';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
// $FlowFixMe (tsx)
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
// $FlowFixMe (tsx)
import Body from '@weco/common/views/components/Body/Body';
import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
// $FlowFixMe(tsx)
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader, {
  getFeaturedMedia,
} from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import type { ArticleSeries } from '@weco/common/model/article-series';
import type { Article } from '@weco/common/model/articles';
import { seasonsFields } from '@weco/common/services/prismic/fetch-links';
/* $FlowFixMe (tsx) */
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';

type Props = {|
  series: ArticleSeries,
  articles: Article[],
|};

export class ArticleSeriesPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { id, memoizedPrismic } = ctx.query;
    const seriesAndArticles = await getArticleSeries(
      ctx.req,
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
        series,
        articles,
        title: series.title,
        description: series.metadataDescription || series.promoText,
        type: 'article-series',
        canonicalUrl: `https://wellcomecollection.org/series/${series.id}`,
        imageUrl: series.image && convertImageUri(series.image.contentUrl, 800),
        siteSection: 'stories',
        analyticsCategory: 'editorial',
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const { series, articles } = this.props;
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
        imageAltText={series.image && series.image.alt}
      >
        <ContentPage
          id={series.id}
          Header={Header}
          Body={<Body body={series.body} pageId={series.id} />}
          contributorProps={{ contributors: series.contributors }}
          seasons={series.seasons}
        >
          {articles.length > 0 && (
            <SearchResults items={series.items} showPosition={true} />
          )}
        </ContentPage>
      </PageLayout>
    );
  }
}

export default ArticleSeriesPage;
