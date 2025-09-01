import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import {
  contentAPILinkedWork,
  workBasic,
} from '@weco/cardigan/stories/data/work';
import { themeValues } from '@weco/common/views/themes/config';
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

export const Basic: Story = {
  args: {
    work: workBasic,
    variant: 'default',
  },

  name: 'RelatedWorksCard',

  render: args => {
    const { seeOnDarkBackground, ...rest } = args;

    return (
      <div
        style={{
          backgroundColor: themeValues.color(
            seeOnDarkBackground ? 'neutral.700' : 'white'
          ),
          padding: seeOnDarkBackground ? '20px' : '0',
          maxWidth: '420px',
        }}
      >
        <RelatedWorksCard {...rest} />
        <svg
          style={{ position: 'absolute', visibility: 'hidden' }}
          width="0"
          height="0"
        >
          <defs>
            <filter id="border-radius-mask">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="2"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 100 -50"
                result="mask"
              />
              <feComposite in="SourceGraphic" in2="mask" operator="atop" />
            </filter>
          </defs>
        </svg>
      </div>
    );
  },
};
