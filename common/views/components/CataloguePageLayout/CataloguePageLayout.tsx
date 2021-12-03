import { FunctionComponent, useEffect, useState } from 'react';
import { RichTextNodeType } from '@prismicio/types';
import PageLayout, { Props as PageLayoutProps } from '../PageLayout/PageLayout';
import InfoBanner from '../InfoBanner/InfoBanner';
import { emptyGlobalAlert } from '../../../services/prismic/documents';

type Props = {
  hideTopContent?: boolean;
} & PageLayoutProps;

const CataloguePageLayout: FunctionComponent<Props> = ({
  hideTopContent = false,
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
    <PageLayout {...props}>
      {!hideTopContent && (
        <>
          {isRedirectBannerVisible && (
            <InfoBanner
              document={emptyGlobalAlert({
                text: [
                  {
                    type: 'paragraph' as RichTextNodeType.paragraph,
                    text: `Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`,
                    spans: [],
                  },
                ],
              })}
              cookieName="WC_wellcomeImagesRedirect"
            />
          )}
        </>
      )}
      {children}
    </PageLayout>
  );
};

export default CataloguePageLayout;
