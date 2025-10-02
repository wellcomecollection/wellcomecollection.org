import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import InfoBanner from '@weco/common/views/components/InfoBanner';
import Readme from '@weco/common/views/components/InfoBanner/README.mdx';

const meta: Meta<typeof InfoBanner> = {
  title: 'Components/Banners/InfoBanner',
  component: InfoBanner,
  args: {
    variant: 'default',
    document: {
      data: {
        isShown: 'show',
        routeRegex: '',
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
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['default', 'websiteIssues'],
    },
    document: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof InfoBanner>;

export const Basic: Story = {
  name: 'InfoBanner',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={InfoBanner}
      args={args}
      Readme={Readme}
    />
  ),
};
