// @flow
import {Fragment, Component} from 'react';
import {getArticle} from '@weco/common/services/prismic/articles';
import {getArticleSeries} from '@weco/common/services/prismic/article-series';
import {classNames, spacing, font} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import HeaderText from '@weco/common/views/components/HeaderText/HeaderText';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import Body from '@weco/common/views/components/Body/Body';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
import TextLayout from '@weco/common/views/components/TextLayout/TextLayout';
import Breadcrumb from '@weco/common/views/components/Breadcrumb/Breadcrumb';
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
    // TODO: We shouldn't need this, but do for flow as
    // `GetInitialPropsClientProps` doesn't have `req`
    // if (context.req) {
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
    // }
  }

  async componentDidMount() {
    const seriesPromises = this.props.article.series.map(series => getArticleSeries(null, { id: series.id }));
    const listOfSeries = await Promise.all(seriesPromises);
    this.setState({ listOfSeries });
  }

  render() {
    const article = this.props.article;
    const crumbs = [{
      url: '/stories',
      text: 'Stories'
    }].concat(article.series.map(series => ({
      url: `/series/${series.id}`,
      text: series.title || '',
      prefix: 'Part of'
    })));

    const Header = (
      <TextLayout>
        <HeaderText
          Breadcrumb={<Breadcrumb items={crumbs} />}
          Heading={<h1 className='h1 inline-block no-margin'>{article.title}</h1>}
          DateInfo={null}
          InfoBar={
            <div className={classNames({
              'flex': true,
              [font({s: 'HNM5'})]: true
            })}>
              <p className={classNames({
                [spacing({s: 1}, {margin: ['right']})]: true,
                [spacing({s: 0}, {margin: ['bottom']})]: true
              })}>
                <b>By </b>
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
          }
          Description={article.summary ? <PrismicHtmlBlock html={article.summary} /> : null}
        />
      </TextLayout>
    );

    return (
      <BasePage
        id={article.id}
        Header={Header}
        Body={<Body body={article.body} isCreamy={true} />}
      >
        {this.state.listOfSeries.map(({series, articles}) => {
          return <SearchResults
            key={series.id}
            title={`Read more from ${series.title}`}
            items={articles} />;
        })}
      </BasePage>
    );
  }
};

export default PageWrapper(ArticlePage);
