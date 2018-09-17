// @flow
import {Fragment} from 'react';
import {getArticle} from '@weco/common/services/prismic/articles';
import {classNames, spacing, font} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import Body from '@weco/common/views/components/Body/Body';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import AsyncSearchResults from '@weco/common/views/components/SearchResults/AsyncSearchResults';
import {
  default as PageHeader,
  getFeaturedMedia,
  getHeroPicture
} from '@weco/common/views/components/PageHeader/PageHeader';
import type {ArticleV2} from '@weco/common/services/prismic/articles';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';

type Props = {|
  article: ArticleV2
|}

export const ArticlePage = ({
  article
}: Props) => {
  const breadcrumbs = {
    items: [{
      url: '/stories',
      text: 'Stories'
    }].concat(article.series.map(series => ({
      url: `/series/${series.id}`,
      text: series.title || '',
      prefix: 'Part of'
    })))
  };

  // TODO: do this properly
  const labels = {
    labels: [{
      url: null,
      text: 'Essay'
    }]
  };

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
  const ContentTypeInfoComponent = standfirst &&
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
    </Fragment>;
  // This is for content that we don't have the crops for in Prismic
  const maybeHeroPicture = getHeroPicture(genericFields);
  const maybeFeaturedMedia = !maybeHeroPicture ? getFeaturedMedia(genericFields) : null;

  const ArticlePageHeader = <PageHeader
    breadcrumbs={breadcrumbs}
    labels={labels}
    title={article.title}
    ContentTypeInfo={ContentTypeInfoComponent}
    Background={null}
    FeaturedMedia={maybeFeaturedMedia}
    HeroPicture={maybeHeroPicture}
  />;

  return (
    <BasePage
      id={article.id}
      Header={ArticlePageHeader}
      Body={<Body body={article.body} isCreamy={true} />}
    >
      {article.series.map(series => (
        <AsyncSearchResults
          key={series.id}
          title={`Read more from ${series.title || ''}`}
          query={`article-series:${series.id}`} />
      ))}
    </BasePage>
  );
};

ArticlePage.getInitialProps = async ({req, query}) => {
  // TODO: We shouldn't need this, but do for flow as
  // `GetInitialPropsClientProps` doesn't have `req`
  if (req) {
    const {id} = query;
    const article = await getArticle(req, id);

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
};

export default PageWrapper(ArticlePage);
