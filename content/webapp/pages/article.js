// @flow
import {getArticle} from '@weco/common/services/prismic/articles';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import BaseHeader from '@weco/common/views/components/BaseHeader/BaseHeader';
import HeaderBackground from '@weco/common/views/components/BaseHeader/HeaderBackground';
import Body from '@weco/common/views/components/Body/Body';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import type {ArticleV2} from '@weco/common/services/prismic/articles';

type Props = {|
  article: ArticleV2
|}

export const ArticlePage = ({
  article
}: Props) => {
  const Header = (<BaseHeader
    title={article.title || ''}
    Background={<HeaderBackground hasWobblyEdge={true} />}
    TagBar={null}
    DateInfo={null}
    InfoBar={null}
    Description={article.summary ? <PrismicHtmlBlock html={article.summary} /> : null}
    FeaturedMedia={null}
    LabelBar={null}
    isFree={false}
    topLink={null}
  />);

  return (
    <BasePage
      id={article.id}
      Header={Header}
      Body={<Body body={article.body} />}
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
