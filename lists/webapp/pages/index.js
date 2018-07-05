// @flow
import Prismic from 'prismic-javascript';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';

const IndexPage = () => (
  <div>HomePage</div>
);

IndexPage.getInitialProps = async ({req}) => {
  const api = await Prismic.getApi('https://wellcomecollection.prismic.io/api/v2', {req});
  const graphQuery = `{
    articles {
      title
    }
  }`;
  const article = await api.getByID('WyjPPScAALyZnoX7', { graphQuery });
  console.info(article);
};

export default PageWrapper(IndexPage);
