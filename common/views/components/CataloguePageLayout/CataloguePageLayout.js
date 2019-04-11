// @flow
import PageLayout, { type Props } from '../PageLayout/PageLayout';
import { SearchLoggerScript } from '../SearchLogger/SearchLogger';

const CataloguePageLayout = (props: Props) => (
  <>
    <SearchLoggerScript />
    <PageLayout {...props} />
  </>
);
export default CataloguePageLayout;
