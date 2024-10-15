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
  render: args => (
    <ReadmeDecorator
      WrappedComponent={WebsiteIssuesBanner}
      args={args}
      Readme={Readme}
    />
  ),
};
