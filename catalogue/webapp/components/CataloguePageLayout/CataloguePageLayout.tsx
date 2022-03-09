import { FunctionComponent, useEffect, useState } from 'react';
import { RichTextNodeType } from '@prismicio/types';
import PageLayout, {
  Props as PageLayoutProps,
} from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import { emptyGlobalAlert } from '@weco/common/services/prismic/documents';
import { wellcomeImagesRedirectBanner } from '@weco/common/data/microcopy';

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
                    type: RichTextNodeType.paragraph,
                    text: wellcomeImagesRedirectBanner,
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
