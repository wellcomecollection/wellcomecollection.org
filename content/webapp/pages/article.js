// @flow
import {getArticle} from '@weco/common/services/prismic/articles';
import {classNames, spacing} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import HeaderText from '@weco/common/views/components/HeaderText/HeaderText';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import Body from '@weco/common/views/components/Body/Body';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import TextLayout from '@weco/common/views/components/TextLayout/TextLayout';
import type {ArticleV2} from '@weco/common/services/prismic/articles';

type Props = {|
  article: ArticleV2
|}

export const ArticlePage = ({
  article
}: Props) => {
  const Header = (
    <TextLayout>
      <HeaderText
        Heading={<h1 className='h1 inline-block no-margin'>{article.title}</h1>}
        TagBar={null}
        DateInfo={null}
        InfoBar={
          <div className='flex'>
            <p className={classNames({
              [spacing({s: 1}, {margin: ['right']})]: true
            })}><b>By</b></p>
            <LinkLabels items={
              article.contributors.map(({ contributor }) => ({
                url: `/people/${contributor.id}`,
                text: contributor.name
              }))
            } />
            <HTMLDate date={new Date(article.datePublished)} />
          </div>
        }
        Description={article.summary ? <PrismicHtmlBlock html={article.summary} /> : null}
        topLink={{ text: 'Articles', url: '/stories' }}
      />
    </TextLayout>
  );

  return (
    <BasePage
      id={article.id}
      Header={Header}
      Body={<Body body={article.body} isCreamy={true} />}
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
