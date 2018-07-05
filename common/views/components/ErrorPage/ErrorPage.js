// @flow
import PageWrapper from '../PageWrapper/PageWrapper';

const ErrorPage = () => (
  <div></div>
);

ErrorPage.getInitialProps = (context) => {
  return {
    title: 'There was an error',
    description: 'Error pages for ERROR',
    type: 'website',
    canonicalUrl: context.asPath,
    imageUrl: null,
    siteSection: null,
    analyticsCategory: 'error'
  };
};

export default PageWrapper(ErrorPage);
