// @flow
import {Fragment, Component} from 'react';
import {getArticle} from '@weco/common/services/prismic/articles';
import {getArticleSeries} from '@weco/common/services/prismic/article-series';
import {classNames, spacing, font} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import Body from '@weco/common/views/components/Body/Body';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import SeriesNavigation from '@weco/common/views/components/SeriesNavigation/SeriesNavigation';
import PartNumberIndicator from '@weco/common/views/components/PartNumberIndicator/PartNumberIndicator';
import {
  default as PageHeader,
  getFeaturedMedia,
  getHeroPicture
} from '@weco/common/views/components/PageHeader/PageHeader';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import type {Article} from '@weco/common/model/articles';
import type {ArticleScheduleItem} from '@weco/common/model/article-schedule-items';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import {articleLd} from '@weco/common/utils/json-ld';

type Props = {|
  article: Article
|}

type State = {|
  listOfSeries: any[]
|}
export class ArticlePage extends Component<Props, State> {
  state = {
    listOfSeries: []
  }

  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {id} = context.query;
    const article = await getArticle(context.req, id);

    if (article) {
      return {
        article,
        title: article.title,
        description: article.promoText,
        type: 'article',
        canonicalUrl: `https://wellcomecollection.org/articles/${article.id}`,
        imageUrl: article.image && convertImageUri(article.image.contentUrl, 800),
        siteSection: 'stories',
        analyticsCategory: 'editorial',
        pageJsonLd: articleLd(article)
      };
    } else {
      return {statusCode: 404};
    }
  }

  async componentDidMount() {
    // GOTCHA: we only take the first of the series list as the data is being
    // used a little bit badly, but we don't have capacity to implement a
    // better solution
    const seriesPromises = this.props.article.series.slice(0, 1).map(series =>
      getArticleSeries(null, { id: series.id, pageSize: 3 })
    );
    const listOfSeries = await Promise.all(seriesPromises);
    this.setState({ listOfSeries });
  }

  render() {
    const article = this.props.article;

    const breadcrumbs = {
      items: [{
        url: '/stories',
        text: 'Stories'
      }]
      // GOTCHA: we only take the first of the series list as the data is being
      // used a little bit badly, but we don't have capacity to implement a
      // better solution
        .concat(article.series.slice(0, 1).map(series => ({
          url: `/series/${series.id}`,
          text: series.title || '',
          prefix: `Part of`
        })))
    };

    const partOfSerial = article.series
      .map(series => {
        const titles = series.schedule.map(item => item.title);
        const positionInSerial = titles.indexOf(article.title);
        return positionInSerial + 1;
      }).find(_ => _);

    // We can abstract this out as a component if we see it elsewhere.
    // Not too confident it's going to be used like this for long.
    const TitleTopper = !partOfSerial ? null
      : <PartNumberIndicator n={partOfSerial} />;

    const genericFields = {
      id: article.id,
      title: article.title,
      contributors: article.contributors,
      contributorsTitle: article.contributorsTitle,
      promo: article.promo,
      body: article.body,
      promoImage: article.promoImage,
      promoText: article.promoText,
      image: article.image,
      squareImage: article.squareImage,
      widescreenImage: article.widescreenImage,
      labels: article.labels
    };
    const standfirst = article.body.find(slice => slice.type === 'standfirst');
    const ContentTypeInfo = standfirst &&
      <Fragment>
        <div className={classNames({
          'first-para-no-margin': true,
          [spacing({s: 1}, {margin: ['top']})]: true
        })}>
          <PrismicHtmlBlock html={standfirst.value} />
        </div>
        <div className={classNames({
          'flex': true,
          'flex--h-baseline': true,
          [font({s: 'HNM5'})]: true
        })}>
          <p className={classNames({
            [spacing({s: 1}, {margin: ['top']})]: true,
            [spacing({s: 1}, {margin: ['right']})]: true,
            [spacing({s: 0}, {margin: ['bottom']})]: true
          })}>
            <span className={classNames({
              [font({s: 'HNB5'})]: true
            })}>By </span>
            {article.contributors.map(({ contributor }, i, arr) => (
              <Fragment key={contributor.id}>
                <a
                  className={'plain-link font-green'}
                  href={`/${contributor.type}/${contributor.id}`}>
                  {contributor.name}
                </a>

                {i < arr.length - 1 && ', '}
              </Fragment>
            ))}
          </p>
          <div className={classNames({
            'font-pewter': true,
            [font({s: 'HNL5'})]: true
          })}>
            <HTMLDate date={new Date(article.datePublished)} />
          </div>
        </div>
      </Fragment>;
    // This is for content that we don't have the crops for in Prismic
    const maybeHeroPicture = getHeroPicture(genericFields);
    const maybeFeaturedMedia = !maybeHeroPicture ? getFeaturedMedia(genericFields) : null;
    const Header = <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{labels: article.labels}}
      title={article.title}
      ContentTypeInfo={ContentTypeInfo}
      Background={null}
      FeaturedMedia={maybeFeaturedMedia}
      HeroPicture={maybeHeroPicture}
      heroImageBgColor={'cream'}
      TitleTopper={TitleTopper}
    />;

    return (
      <BasePage
        id={article.id}
        isCreamy={true}
        Header={Header}
        Body={<Body body={article.body} />}
        contributorProps={{contributors: article.contributors}}
      >
        {this.state.listOfSeries.map(({series, articles}) => {
          if (partOfSerial && series.schedule && series.schedule.length > 0) {
            const nextUp = partOfSerial - 1 === series.schedule.length ? articles[0]
              : articles[partOfSerial] ? articles[partOfSerial] : null;

            const nextUpNotPublished = nextUp ? null
              : ({
                type: 'article-schedule-items',
                id: series.schedule[partOfSerial].title,
                publishDate: new Date(series.schedule[partOfSerial].publishDate),
                partNumber: partOfSerial + 1,
                url: `/series/${series.id}`,
                ...series.schedule[partOfSerial]
              }: ArticleScheduleItem);

            return nextUp
              ? (
                <div className={`${spacing({s: 6}, {margin: ['top']})}`}>
                  <SeriesNavigation
                    key={series.id}
                    series={series}
                    items={([nextUp]: Article[])} />
                </div>
              )
              : nextUpNotPublished ? (
                <div className={`${spacing({s: 6}, {margin: ['top']})}`}>
                  <SeriesNavigation
                    key={series.id}
                    series={series}
                    items={([nextUpNotPublished]: ArticleScheduleItem[])} />
                </div>
              ) : null;
          } else {
            // Overkill? Should this happen on the API?
            const dedupedArticles = articles.filter(
              a => a.id !== article.id
            ).slice(0, 2);
            return (
              <div className={`${spacing({s: 6}, {margin: ['top']})}`}>
                <SeriesNavigation
                  key={series.id}
                  series={series}
                  items={dedupedArticles} />
              </div>
            );
          }
        })}
      </BasePage>
    );
  }
};

export default PageWrapper(ArticlePage);
