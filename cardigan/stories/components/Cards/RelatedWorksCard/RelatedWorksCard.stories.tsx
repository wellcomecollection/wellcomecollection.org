import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, FunctionComponent } from 'react';
import { useTheme } from 'styled-components';

import {
  contentAPILinkedWork,
  workBasic,
} from '@weco/cardigan/stories/data/work';
import RelatedWorksCard from '@weco/content/views/components/RelatedWorksCard';

// Extend the story type with seeOnDarkBackground
type RelatedWorksCardStoryProps = ComponentProps<typeof RelatedWorksCard> & {
  seeOnDarkBackground?: boolean;
};

const meta: Meta<RelatedWorksCardStoryProps> = {
  title: 'Components/Cards/RelatedWorksCard',
  component: RelatedWorksCard,
  args: {
    work: workBasic,
    seeOnDarkBackground: false,
  },
  argTypes: {
    work: {
      control: { type: 'select' },
      options: ['Catalogue API', 'Content API'],
      mapping: {
        'Catalogue API': workBasic,
        'Content API': contentAPILinkedWork,
      },
    },
    seeOnDarkBackground: {
      name: 'See on dark background',
    },
    gtmData: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<RelatedWorksCardStoryProps>;

const RelatedWorksCardStory: FunctionComponent<
  RelatedWorksCardStoryProps
> = args => {
  const { seeOnDarkBackground, ...rest } = args;
  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.color(
          seeOnDarkBackground ? 'neutral.700' : 'white'
        ),
        padding: seeOnDarkBackground ? '20px' : '0',
        maxWidth: '420px',
      }}
    >
      <RelatedWorksCard {...rest} />
    </div>
  );
};

export const Basic: Story = {
  args: {
    work: workBasic,
    variant: 'default',
  },

  name: 'RelatedWorksCard',

  render: args => <RelatedWorksCardStory {...args} />,
};
