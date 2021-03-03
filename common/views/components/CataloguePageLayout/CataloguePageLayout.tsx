import { FunctionComponent, useEffect, useState } from 'react';
import PageLayout, { Props as PageLayoutProps } from '../PageLayout/PageLayout';
import InfoBanner from '../InfoBanner/InfoBanner';

type Props = {
  hideInfoBar?: boolean;
} & PageLayoutProps;

const CataloguePageLayout: FunctionComponent<Props> = ({
  hideInfoBar,
  children,
  ...props
}: Props) => {
  const [isRedirectBannerVisible, setIsRedirectBannerVisible] = useState(false);
  useEffect(() => {
    if (window.location.search.match('wellcomeImagesUrl')) {
      setIsRedirectBannerVisible(true);
    }
  }, []);

  return (
    <>
      <PageLayout {...props}>
        {hideInfoBar !== true && (
          <>
            {isRedirectBannerVisible && (
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
            )}
          </>
        )}
        {children}
      </PageLayout>
    </>
  );
};

export default CataloguePageLayout;
