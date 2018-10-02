// @flow
import {Component} from 'react';
import {getArticleSeries} from '@weco/common/services/prismic/article-series';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import Body from '@weco/common/views/components/Body/Body';
import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
import {
  default as PageHeader,
  getFeaturedMedia
} from '@weco/common/views/components/PageHeader/PageHeader';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import type {ArticleSeries} from '@weco/common/model/article-series';
import type {Article} from '@weco/common/model/articles';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

type Props = {|
  series: ArticleSeries,
  articles: Article[]
|}

export class ArticleSeriesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {id} = context.query;
    const seriesAndArticles = await getArticleSeries(context.req, {id});

    if (seriesAndArticles) {
      const {series, articles} = seriesAndArticles;
      return {
        series,
        articles,
        title: series.title,
        description: series.promoText,
        type: 'article-series',
        canonicalUrl: `https://wellcomecollection.org/series/${series.id}`,
        imageUrl: series.image && convertImageUri(series.image.contentUrl, 800),
        siteSection: 'stories',
        analyticsCategory: 'editorial'
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    const {series, articles} = this.props;
    const breadcrumbs = {
      items: [{
        url: '/stories',
        text: 'Stories'
      }]
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
      labels: series.labels
    };

    const ContentTypeInfo = series.standfirst && <PageHeaderStandfirst html={series.standfirst} />;
    const FeaturedMedia = getFeaturedMedia(genericFields);
    const Header = <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{labels: series.labels}}
      title={series.title}
      ContentTypeInfo={ContentTypeInfo}
      Background={null}
      FeaturedMedia={FeaturedMedia}
      HeroPicture={null}
    />;

    return (
      <BasePage
        id={series.id}
        isCreamy={true}
        Header={Header}
        Body={<Body body={series.body} />}
      >
        {articles.length > 0 &&
          <SearchResults items={articles} />
        }
      </BasePage>
    );
  }
};

export default PageWrapper(ArticleSeriesPage);
