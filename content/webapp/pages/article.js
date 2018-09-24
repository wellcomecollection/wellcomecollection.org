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
import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
import {
  default as PageHeader,
  getFeaturedMedia,
  getHeroPicture
} from '@weco/common/views/components/PageHeader/PageHeader';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import type {Article} from '@weco/common/model/articles';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

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
        analyticsCategory: 'editorial'
      };
    } else {
      return {statusCode: 404};
    }
  }

  async componentDidMount() {
    const seriesPromises = this.props.article.series.map(series => getArticleSeries(null, { id: series.id }));
    const listOfSeries = await Promise.all(seriesPromises);
    this.setState({ listOfSeries });
  }

  render() {
    const article = this.props.article;

    const breadcrumbs = {
      items: [{
        url: '/stories',
        text: 'Stories'
      }].concat(article.series.map(series => ({
        url: `/series/${series.id}`,
        text: series.title || '',
        prefix: `Part of`
      })))
    };

    // TODO: do this properly
    const labels = {
      labels: [{
        url: null,
        text: 'Essay'
      }]
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
      : <div className={classNames({
        [font({s: 'WB7'})]: true
      })}>Part
        <span
          className={classNames({
            'bg-purple': true,
            [spacing({s: 1}, {margin: ['left']})]: true
          })}
          style={{
            transform: 'rotateZ(-6deg)',
            width: '24px',
            height: '24px',
            display: 'inline-block',
            borderRadius: '3px',
            textAlign: 'center'
          }}>
          <span className={'font-white'} style={{transform: 'rotateZ(6deg) scale(1.2)'}}>
            {partOfSerial}
          </span>
        </span>
      </div>;

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
      widescreenImage: article.widescreenImage
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
      labels={labels}
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
        Header={Header}
        Body={<Body body={article.body} isCreamy={true} />}
        contributorProps={{contributors: article.contributors}}
      >
        {this.state.listOfSeries.map(({series, articles}) => {
          return <SearchResults
            key={series.id}
            title={`Read more from ${series.title}`}
            summary={series.promoText}
            items={articles} />;
        })}
      </BasePage>
    );
  }
};

export default PageWrapper(ArticlePage);
