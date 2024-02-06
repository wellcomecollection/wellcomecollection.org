import {
  InfoBanner,
  WebsiteIssuesBanner,
} from '@weco/common/views/components/InfoBanners';
import Readme from '@weco/common/views/components/InfoBanners/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const InfoBannerTemplate = args => (
  <ReadmeDecorator WrappedComponent={InfoBanner} args={args} Readme={Readme} />
);
export const infoBanner = InfoBannerTemplate.bind({});
infoBanner.args = {
  document: {
    data: {
      text: [
        {
          type: 'paragraph',
          text: `Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`,
          spans: [],
        },
      ],
    },
  },
};
infoBanner.storyName = 'InfoBanner';

const WebsiteIssuesBannerTemplate = () => (
  <ReadmeDecorator WrappedComponent={WebsiteIssuesBanner} Readme={Readme} />
);
export const websiteIssuesBanner = WebsiteIssuesBannerTemplate.bind({});
websiteIssuesBanner.storyName = 'WebsiteIssuesBanner';
