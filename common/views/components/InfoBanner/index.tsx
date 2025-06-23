import { FunctionComponent } from 'react';

import InfoBannerDefault, {
  Props as DefaultBannerProps,
} from './InfoBanner.Default';
import WebsiteIssuesBanner, {
  Props as WebsiteIssuesBannerProps,
} from './InfoBanner.WebsiteIssues';

type Props =
  | (DefaultBannerProps & { variant: 'default' })
  | (WebsiteIssuesBannerProps & { variant: 'websiteIssues' });

const InfoBanner: FunctionComponent<Props> = props => {
  const { variant } = props;

  return (
    <>
      {variant === 'websiteIssues' ? (
        <WebsiteIssuesBanner {...props} />
      ) : (
        <InfoBannerDefault {...props} />
      )}
    </>
  );
};

export default InfoBanner;
