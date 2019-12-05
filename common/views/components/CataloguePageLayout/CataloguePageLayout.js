// @flow
import PageLayout, {
  type Props as PageLayoutProps,
} from '../PageLayout/PageLayout';
import InfoBanner from '../InfoBanner/InfoBanner';
import Layout12 from '../Layout12/Layout12';
import BetaBar from '../BetaBar/BetaBar';

type Props = {|
  ...PageLayoutProps,
  hideInfoBar?: boolean,
|};

const CataloguePageLayout = (props: Props) => {
  const { children, hideInfoBar, ...extraProps } = props;
  return (
    <>
      <PageLayout {...extraProps}>
        {hideInfoBar !== true && (
          <>
            <InfoBanner
              text={[
                {
                  type: 'paragraph',
                  text: `Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`,
                  spans: [],
                },
              ]}
              cookieName="WC_wellcomeImagesRedirect"
            />

            <Layout12>
              <BetaBar />
            </Layout12>
          </>
        )}
        {children}
      </PageLayout>
    </>
  );
};
export default CataloguePageLayout;
