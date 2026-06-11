import { FunctionComponent } from 'react';

import InfoBannerDefault, {
  Props as DefaultBannerProps,
} from './InfoBanner.Default';
import TendernessAndRageKioskBanners from './InfoBanner.TRKioskBanners';
import WebsiteIssuesBanner, {
  Props as WebsiteIssuesBannerProps,
} from './InfoBanner.WebsiteIssues';

type Props =
  | (DefaultBannerProps & { variant: 'default' })
  | (WebsiteIssuesBannerProps & { variant: 'websiteIssues' })
  | { variant: 'kioskTRBanners' };

const InfoBanner: FunctionComponent<Props> = props => {
  const { variant } = props;

  return (
    <>
      {variant === 'kioskTRBanners' ? (
        <TendernessAndRageKioskBanners
          data-component="kiosk-tr-banners"
          {...props}
        />
      ) : variant === 'websiteIssues' ? (
        <WebsiteIssuesBanner
          data-component="website-issues-banner"
          {...props}
        />
      ) : (
        <InfoBannerDefault data-component="info-banner" {...props} />
      )}
    </>
  );
};

export default InfoBanner;
