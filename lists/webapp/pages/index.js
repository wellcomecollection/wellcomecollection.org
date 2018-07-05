// @flow
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';

const IndexPage = (d: string) => (
  <div>this is the index</div>
);

IndexPage.getInitialProps = () => {
  return {};
};

export default PageWrapper(IndexPage);
