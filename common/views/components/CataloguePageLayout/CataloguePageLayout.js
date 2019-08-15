// @flow
import PageLayout, { type Props } from '../PageLayout/PageLayout';
import { TrackerScript } from '../Tracker/Tracker';

const CataloguePageLayout = (props: Props) => (
  <>
    <TrackerScript />
    <PageLayout {...props} />
  </>
);
export default CataloguePageLayout;
