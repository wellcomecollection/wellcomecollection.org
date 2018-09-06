// @flow
import {getArticle} from '@weco/common/services/prismic/articles';
import {classNames, spacing} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import BaseHeader from '@weco/common/views/components/BaseHeader/BaseHeader';
import HeaderBackground from '@weco/common/views/components/BaseHeader/HeaderBackground';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import Body from '@weco/common/views/components/Body/Body';
import {parseBody, asText} from '@weco/common/services/prismic/parsers';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';

type Props = {|
  article: any
|}

export const ArticlePage = ({
  article
}: Props) => {
  const {data} = article;
  const Header = (<BaseHeader
    title={asText(data.title) || ''}
    Background={<HeaderBackground hasWobblyEdge={true} />}
    TagBar={null}
    DateInfo={null}
    InfoBar={
      <div className='flex'>
        <p className={classNames({
          [spacing({s: 1}, {margin: ['right']})]: true
        })}><b>By</b></p>
        <LinkLabels items={
          data.contributors.map(({ contributor }) => ({
            url: `/people/${contributor.id}`,
            text: contributor.data.name
          }))
        } />
        <HTMLDate date={new Date(article.first_publication_date)} />
      </div>
    }
    Description={data.summary ? <PrismicHtmlBlock html={data.summary} /> : null}
    FeaturedMedia={null}
    LabelBar={null}
    isFree={false}
    topLink={{ text: 'Articles', url: '/stories' }}
  />);

  return (
    <BasePage
      id={article.id}
      Header={Header}
      Body={<Body body={parseBody(article.data.body)} />}
    >
    </BasePage>
  );
};

ArticlePage.getInitialProps = async ({req, query}) => {
  // TODO: We shouldn't need this, but do for flow as
  // `GetInitialPropsClientProps` doesn't have `req`
  if (req) {
    const {id} = query;
    const article = await getArticle(req, id);

    return {
      article
    };
  }
};

export default PageWrapper(ArticlePage);
