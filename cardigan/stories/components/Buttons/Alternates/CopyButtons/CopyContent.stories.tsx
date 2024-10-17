import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { singleLineOfText } from '@weco/cardigan/stories/data/text';
import { CopyContent } from '@weco/content/components/CopyButtons';
import Readme from '@weco/content/components/CopyButtons/README.mdx';

const content = singleLineOfText();

const meta: Meta<typeof CopyContent> = {
  title: 'Components/Buttons/Alternates/CopyContent',
  component: CopyContent,
  args: {
    CTA: 'Copy credit information',
    content,
    displayedContent: <p>{content}</p>,
  },
};

export default meta;

type Story = StoryObj<typeof CopyContent>;

export const Basic: Story = {
  name: 'CopyContent',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={CopyContent}
      args={args}
      Readme={Readme}
    />
  ),
};
