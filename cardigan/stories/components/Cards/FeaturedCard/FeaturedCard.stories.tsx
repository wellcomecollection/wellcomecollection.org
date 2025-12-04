import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { exhibitionBasic } from '@weco/cardigan/stories/data/content';
import { contentAPIArticle } from '@weco/cardigan/stories/data/contentAPI.content';
import { image } from '@weco/cardigan/stories/data/images';
import { font } from '@weco/common/utils/classnames';
import FeaturedCard from '@weco/content/views/components/FeaturedCard';
import Readme from '@weco/content/views/components/FeaturedCard/README.mdx';

const meta: Meta<typeof FeaturedCard> = {
  title: 'Components/Cards/FeaturedCard',
  component: FeaturedCard,
  args: {
    type: 'card',
    image: image(),
    labels: [{ text: 'Page' }],
    link: { url: '#', text: 'Remote diagnosis from wee to the web' },
    background: 'neutral.700',
    textColor: 'white',
    isReversed: false,
  },
  argTypes: {
    type: {
      options: ['card', 'exhibition', 'article'],
      control: { type: 'radio' },
    },
    background: {
      options: ['neutral.700', 'warmNeutral.300'],
      control: { type: 'select' },
    },
    textColor: {
      options: ['white', 'black'],
      control: { type: 'select' },
    },
    labels: {
      table: {
        disable: true,
      },
    },
    link: {
      table: {
        disable: true,
      },
    },
    image: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FeaturedCard>;
export const Basic: Story = {
  name: 'FeaturedCard',
  render: args => {
    return (
      <ReadmeDecorator
        WrappedComponent={FeaturedCard}
        args={{
          ...args,
          type: args.type || 'card',
          image: image(),
          link: { url: '#', text: 'Remote diagnosis from wee to the web' },
          ...(args.type === 'article' && { article: contentAPIArticle }),
          ...(args.type === 'exhibition' && { exhibition: exhibitionBasic }),
        }}
        Readme={Readme}
      >
        <h2 className={font('brand', 2)}>
          Remote diagnosis from wee to the Web
        </h2>
        <p className={font('sans', -1)}>
          Medical practice might have moved on from when patients posted flasks
          of their urine for doctors to taste, but telehealth today keeps up the
          tradition of remote diagnosis – to our possible detriment.
        </p>
      </ReadmeDecorator>
    );
  },
};
