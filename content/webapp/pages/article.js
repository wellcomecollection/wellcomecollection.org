// @flow
import type { Context } from 'next';
import { Fragment, Component } from 'react';
import type { Article } from '@weco/common/model/articles';
import type { ArticleScheduleItem } from '@weco/common/model/article-schedule-items';
import type { PrismicApiError } from '@weco/common/services/prismic/types';
import { getArticle } from '@weco/common/services/prismic/articles';
import { getArticleSeries } from '@weco/common/services/prismic/article-series';
import { classNames, spacing, font } from '@weco/common/utils/classnames';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import Body from '@weco/common/views/components/Body/Body';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import SeriesNavigation from '@weco/common/views/components/SeriesNavigation/SeriesNavigation';
import PartNumberIndicator from '@weco/common/views/components/PartNumberIndicator/PartNumberIndicator';
import PageHeader, {
  getFeaturedMedia,
  getHeroPicture,
} from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { articleLd } from '@weco/common/utils/json-ld';
import { ContentFormatIds } from '@weco/common/model/content-format-id';

type Props = {|
  article: Article,
|};

type State = {|
  listOfSeries: any[],
|};

function articleHasOutro(article: Article) {
  return Boolean(
    article.outroResearchItem || article.outroReadItem || article.outroVisitItem
  );
}

export class ArticlePage extends Component<Props, State> {
  state = {
    listOfSeries: [],
  };

  static getInitialProps = async (
    ctx: Context
  ): Promise<?Props | PrismicApiError> => {
    const { id } = ctx.query;
    const article = await getArticle(ctx.req, id);
    if (article) {
      return {
        article,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  async componentDidMount() {
    // GOTCHA: we only take the first of the series list as the data is being
    // used a little bit badly, but we don't have capacity to implement a
    // better solution
    const seriesPromises = this.props.article.series.slice(0, 1).map(series =>
      getArticleSeries(null, {
        id: series.id,
        pageSize: 6,
      })
    );
    const listOfSeries = await Promise.all(seriesPromises);
    this.setState({ listOfSeries });
  }

  render() {
    const { article } = this.props;

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

    // Check if the article is in a serial, and where
    const serial = article.series.find(series => series.schedule.length > 0);
    const titlesInSerial = serial && serial.schedule.map(item => item.title);
    const positionInSerial =
      titlesInSerial && titlesInSerial.indexOf(article.title) + 1;

    // We can abstract this out as a component if we see it elsewhere.
    // Not too confident it's going to be used like this for long.
    const TitleTopper = serial && positionInSerial && (
      <PartNumberIndicator number={positionInSerial} color={serial.color} />
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
      labels: article.labels,
      metadataDescription: article.metadataDescription,
    };

    const ContentTypeInfo = (
      <Fragment>
        {article.standfirst && (
          <PageHeaderStandfirst html={article.standfirst} />
        )}
        <div
          className={classNames({
            flex: true,
            'flex--h-baseline': true,
          })}
        >
          <p
            className={classNames({
              [spacing({ s: 1 }, { margin: ['top'] })]: true,
              [spacing({ s: 1 }, { margin: ['right'] })]: true,
              [spacing({ s: 0 }, { margin: ['bottom'] })]: true,
              [font('hnl', 6)]: true,
            })}
          >
            {article.contributors.length > 0 && <span>By </span>}

            {article.contributors.map(({ contributor }, i, arr) => (
              <Fragment key={contributor.id}>
                <span
                  className={classNames({
                    [font('hnm', 6)]: true,
                  })}
                >
                  {contributor.name}
                </span>
                {arr.length > 1 && i < arr.length - 2 && ', '}
                {arr.length > 1 && i === arr.length - 2 && ' and '}
              </Fragment>
            ))}

            {article.contributors.length > 0 && ' '}

            <span
              className={classNames({
                'font-pewter': true,
                [font('hnl', 6)]: true,
              })}
            >
              <HTMLDate date={new Date(article.datePublished)} />
            </span>
          </p>
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
      (article.format.id === ContentFormatIds.ImageGallery ||
        article.format.id === ContentFormatIds.Comic);

    const Header = (
      <PageHeader
        breadcrumbs={breadcrumbs}
        labels={{ labels: article.labels }}
        title={article.title}
        ContentTypeInfo={ContentTypeInfo}
        Background={null}
        FeaturedMedia={isImageGallery ? null : maybeFeaturedMedia}
        HeroPicture={isImageGallery ? null : maybeHeroPicture}
        heroImageBgColor={isImageGallery ? 'white' : 'cream'}
        TitleTopper={TitleTopper}
      />
    );

    const Siblings = this.state.listOfSeries
      .map(({ series, articles }) => {
        if (series.schedule.length > 0 && positionInSerial) {
          const nextUp =
            positionInSerial === series.schedule.length
              ? series.items[0]
              : series.items[positionInSerial]
              ? series.items[positionInSerial]
              : null;

          return (
            nextUp && (
              <SeriesNavigation
                key={series.id}
                series={series}
                items={
                  ([nextUp]: $ReadOnlyArray<Article | ArticleScheduleItem>)
                }
              />
            )
          );
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
        imageUrl={
          article.image && convertImageUri(article.image.contentUrl, 800)
        }
        imageAltText={article.image && article.image.alt}
      >
        <ContentPage
          id={article.id}
          isCreamy={true}
          Header={Header}
          Body={
            <Body body={article.body} isDropCapped={true} pageId={article.id} />
          }
          Siblings={Siblings}
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
              : null
          }
        />
      </PageLayout>
    );
  }
}

export default ArticlePage;
