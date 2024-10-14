import { Meta, StoryObj } from '@storybook/react';

import { prismicRichTextMultiline } from '@weco/cardigan/stories/data/text';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';

const meta: Meta<typeof CollapsibleContent> = {
  title: 'Components/CollapsibleContent',
  component: CollapsibleContent,
  args: {
    id: 'test',
    controlText: {
      defaultText: 'Show me more',
      contentShowingText: 'Show me less',
    },
    children: <PrismicHtmlBlock html={prismicRichTextMultiline} />,
  },
};

export default meta;

type Story = StoryObj<typeof CollapsibleContent>;

export const Basic: Story = {
  name: 'CollapsibleContent',
};
