import { FunctionComponent, useEffect, useState } from 'react';
import { RichTextNodeType } from '@prismicio/types';
import PageLayout, { Props as PageLayoutProps } from '../PageLayout/PageLayout';
import InfoBanner from '../InfoBanner/InfoBanner';
import { emptyGlobalAlert } from '../../../services/prismic/documents';
import { wellcomeImagesRedirectBanner } from 'data/microcopy';

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
