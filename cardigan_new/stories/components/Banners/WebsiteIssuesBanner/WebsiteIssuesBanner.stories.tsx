import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan_new/config/decorators';
import { WebsiteIssuesBanner } from '@weco/common/views/components/InfoBanners';
import Readme from '@weco/common/views/components/InfoBanners/README.mdx';

const meta: Meta<typeof WebsiteIssuesBanner> = {
  title: 'Components/Banners/WebsiteIssuesBanner',
  component: WebsiteIssuesBanner,
};

export default meta;

type Story = StoryObj<typeof WebsiteIssuesBanner>;

export const Basic: Story = {
  name: 'WebsiteIssuesBanner',
  args: {
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
  },
  render: args => (
    <ReadmeDecorator
      WrappedComponent={WebsiteIssuesBanner}
      args={args}
      Readme={Readme}
    />
  ),
};
