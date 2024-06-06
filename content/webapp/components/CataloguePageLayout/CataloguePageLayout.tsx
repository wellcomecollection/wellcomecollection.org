import { FunctionComponent, useEffect, useState } from 'react';
import * as prismic from '@prismicio/client';
import PageLayout, {
  Props as PageLayoutProps,
} from '@weco/common/views/components/PageLayout/PageLayout';
import { InfoBanner } from '@weco/common/views/components/InfoBanners';
import { wellcomeImagesRedirectBanner } from '@weco/common/data/microcopy';
import cookies from '@weco/common/data/cookies';

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
              document={{
                data: {
                  isShown: 'hide',
                  routeRegex: null,
                  text: [
                    {
                      type: prismic.RichTextNodeType.paragraph,
                      text: wellcomeImagesRedirectBanner,
                      spans: [],
                    },
                  ],
                },
              }}
              cookieName={cookies.wellcomeImagesRedirect}
            />
          )}
        </>
      )}
      {children}
    </PageLayout>
  );
};

export default CataloguePageLayout;
